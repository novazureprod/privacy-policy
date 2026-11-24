// Fond « vagues de poussière d'or » en WebGL (three.js) : ~13 000 particules sur des nappes
// ondulantes, avec une vraie profondeur de champ (bokeh) calculée dans le shader.
// La crête de la vague centrale est nette, dense et dorée ; tout ce qui s'en éloigne (vers la
// caméra en bas, vers le fond en haut) grossit, s'adoucit et devient flou.
import * as THREE from "three"

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uScale;
  uniform float uFocus;
  attribute vec4 aSeed;     // x : position le long de la vague, y : écart sous la crête, z : profondeur, w : aléa
  attribute vec3 aColor;
  attribute float aLayer;   // 0 : vague centrale, 1 : vague lointaine, 2 : bokeh du premier plan
  varying vec3 vColor;
  varying float vBlur;
  varying float vAlpha;

  float crest(float x, float z, float t) {
    // Descend depuis la gauche, se creuse au centre, remonte fortement à droite.
    return -0.25 + 0.20 * x * x + 0.16 * x
      + 0.07 * sin(2.1 * x + t * 0.35 + z * 0.8)
      + 0.035 * sin(4.3 * x - t * 0.28 + z * 1.7);
  }

  void main() {
    float t = uTime;
    float x = aSeed.x;
    float d = aSeed.y;
    float z = aSeed.z;
    vec3 p;
    if (aLayer < 0.5) {
      // Vague centrale : les grains sous la crête descendent et se rapprochent de la caméra.
      p = vec3(x, crest(x, z, t) - d, z + d * 1.6);
    } else if (aLayer < 1.5) {
      // Vague lointaine, haute et diffuse.
      p = vec3(x, 0.95 + 0.12 * sin(1.6 * x + t * 0.22) + 0.05 * sin(3.4 * x - t * 0.2) - d * 0.9, -2.6 + z);
    } else {
      // Bokeh du premier plan : grosses particules qui dérivent lentement.
      p = vec3(x + 0.05 * sin(t * 0.15 + aSeed.w * 6.28), -1.35 + d + 0.05 * sin(t * 0.2 + aSeed.w * 12.0), 2.2 + z);
    }
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // Cercle de confusion : distance au plan net (la crête).
    float coc = abs(-mv.z - uFocus);
    vBlur = clamp(coc * 0.9, 0.0, 1.0);
    float base = aLayer > 1.5 ? 2.6 : (0.55 + aSeed.w * 0.9);
    float size = base * (1.0 + coc * 6.0);
    gl_PointSize = size * uScale / -mv.z;

    // Les grains flous étalent leur lumière : on baisse leur intensité pour garder l'équilibre.
    float twinkle = 0.75 + 0.25 * sin(t * (1.0 + aSeed.w * 3.0) + aSeed.w * 40.0);
    vAlpha = twinkle / (1.0 + coc * coc * 14.0);
    if (aLayer > 1.5) vAlpha *= 0.85;
    if (aLayer > 0.5 && aLayer < 1.5) vAlpha *= 2.2;
    // La trame bleue reste discrète ; l'or porte la lumière.
    if (aColor.b > aColor.r) vAlpha *= 0.6;
    vColor = aColor;
  }
`

const FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vBlur;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c) * 2.0;
    if (r > 1.0) discard;
    // Grain net : disque dur ; grain flou : disque doux, légèrement plus clair au bord (bokeh).
    float edge = mix(0.12, 0.55, vBlur);
    float disk = 1.0 - smoothstep(1.0 - edge, 1.0, r);
    float ring = mix(1.0, 0.82 + 0.25 * smoothstep(0.4, 0.95, r), vBlur);
    gl_FragColor = vec4(vColor * ring, disk * vAlpha);
  }
`

const GOLD = [new THREE.Color("#f59e0b"), new THREE.Color("#fbbf24"), new THREE.Color("#fef08a")]
const BLUE = [new THREE.Color("#1e62d0"), new THREE.Color("#3b82f6")]
const pick = (arr: THREE.Color[]) => arr[(Math.random() * arr.length) | 0]

export function mountDustWaves(container: HTMLElement) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const small = window.innerWidth < 700

  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" })
  const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2)
  renderer.setPixelRatio(dpr)
  renderer.setClearColor(0x000000, 0)
  container.appendChild(renderer.domElement)
  renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block"

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50)
  camera.position.set(0, 0, 4)

  // Construction des particules
  const counts = small ? { main: 6500, far: 1500, front: 200 } : { main: 11000, far: 2600, front: 380 }
  const total = counts.main + counts.far + counts.front
  const seed = new Float32Array(total * 4)
  const color = new Float32Array(total * 3)
  const layer = new Float32Array(total)
  let n = 0
  const put = (s: [number, number, number, number], c: THREE.Color, l: number) => {
    seed.set(s, n * 4)
    color.set([c.r, c.g, c.b], n * 3)
    layer[n] = l
    n++
  }

  for (let i = 0; i < counts.main; i++) {
    const x = (Math.random() * 2 - 1) * 3.2
    // Très dense sur la crête, puis de plus en plus clairsemé en descendant.
    const d = Math.pow(Math.random(), 4.2) * 1.35
    const z = (Math.random() - 0.5) * 0.25
    const right = THREE.MathUtils.smoothstep(x, -0.6, 2.2) // la crête de droite est la plus dorée
    const goldChance = d > 0.35 ? 0.85 : 0.25 + right * 0.7
    const c = Math.random() < goldChance ? pick(GOLD) : pick(BLUE)
    put([x, d, z, Math.random()], c, 0)
  }
  for (let i = 0; i < counts.far; i++) {
    const x = (Math.random() * 2 - 1) * 4.2
    const right = THREE.MathUtils.smoothstep(x, -1, 3)
    const c = Math.random() < right ? pick(GOLD) : pick(BLUE)
    put([x, Math.pow(Math.random(), 2) * 0.6, (Math.random() - 0.5) * 0.6, Math.random()], c, 1)
  }
  for (let i = 0; i < counts.front; i++) {
    const c = Math.random() < 0.75 ? pick(GOLD) : pick(BLUE)
    put([(Math.random() * 2 - 1) * 1.6, Math.random() * 0.9, Math.random() * 0.8, Math.random()], c, 2)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(total * 3), 3))
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 4))
  geo.setAttribute("aColor", new THREE.BufferAttribute(color, 3))
  geo.setAttribute("aLayer", new THREE.BufferAttribute(layer, 1))
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20)

  const uniforms = { uTime: { value: 0 }, uScale: { value: 1 }, uFocus: { value: 4 } }
  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const points = new THREE.Points(geo, mat)
  scene.add(points)

  // Voiles de soie : deux rubans lumineux qui suivent les vagues (le halo bleu du drap,
  // et la vague lointaine, bleue à gauche, dorée à droite).
  const silkMat = (far: boolean) =>
    new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        uniform float uTime;
        varying vec2 vUv;
        varying float vX;
        float crest(float x, float t) {
          return -0.25 + 0.20 * x * x + 0.16 * x + 0.07 * sin(2.1 * x + t * 0.35) + 0.035 * sin(4.3 * x - t * 0.28);
        }
        void main() {
          vUv = uv;
          float x = position.x;
          vX = x;
          float t = uTime;
          vec3 p;
          if (${far ? "true" : "false"}) {
            p = vec3(x, 0.98 + 0.12 * sin(1.6 * x + t * 0.22) + 0.05 * sin(3.4 * x - t * 0.2) - uv.y * 0.55, -2.7);
          } else {
            p = vec3(x, crest(x, t) - uv.y * 0.75 + 0.02, -0.05 + uv.y * 0.6);
          }
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec2 vUv;
        varying float vX;
        void main() {
          float v = vUv.y;
          // Lumière concentrée juste sous la crête, qui s'éteint vers le bas et sur les bords.
          float glow = exp(-v * 5.0) * smoothstep(0.0, 0.04, v) + exp(-v * 1.6) * 0.25;
          float sides = smoothstep(-3.6, -2.2, vX) * (1.0 - smoothstep(2.2, 3.6, vX));
          vec3 blue = vec3(0.12, 0.38, 0.82);
          vec3 gold = vec3(0.98, 0.70, 0.25);
          vec3 col = ${far ? "mix(blue, gold, smoothstep(-0.5, 2.5, vX))" : "mix(blue, gold * 0.6, smoothstep(0.6, 3.0, vX) * 0.35)"};
          gl_FragColor = vec4(col, glow * sides * ${far ? "0.22" : "0.32"});
        }
      `,
    })
  const silkGeo = new THREE.PlaneGeometry(7.2, 1, 220, 1)
  silkGeo.translate(0, 0.5, 0) // uv.y = 0 sur la crête, 1 en bas
  const silkNear = new THREE.Mesh(silkGeo, silkMat(false))
  const silkFar = new THREE.Mesh(silkGeo, silkMat(true))
  silkNear.frustumCulled = silkFar.frustumCulled = false
  silkNear.renderOrder = silkFar.renderOrder = -1
  scene.add(silkFar, silkNear)

  const resize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    // Sur écran étroit, on recule un peu pour garder la vague entière.
    camera.position.z = w / h < 0.8 ? 5.2 : 4
    uniforms.uFocus.value = camera.position.z
    camera.updateProjectionMatrix()
    uniforms.uScale.value = h * dpr * 0.012
  }
  resize()
  window.addEventListener("resize", resize)

  // Parallaxe très légère à la souris
  const target = new THREE.Vector2()
  const onMove = (e: PointerEvent) => {
    target.set((e.clientX / window.innerWidth - 0.5) * 0.18, -(e.clientY / window.innerHeight - 0.5) * 0.1)
  }
  window.addEventListener("pointermove", onMove, { passive: true })

  let raf = 0
  let visible = !document.hidden
  const onVis = () => (visible = !document.hidden)
  document.addEventListener("visibilitychange", onVis)
  const clock = new THREE.Clock()
  const tick = () => {
    raf = requestAnimationFrame(tick)
    if (!visible) return
    const dt = Math.min(clock.getDelta(), 0.05)
    if (!reduce) uniforms.uTime.value += dt
    camera.position.x += (target.x - camera.position.x) * 0.03
    camera.position.y += (target.y - camera.position.y) * 0.03
    camera.lookAt(0, 0, 0)
    renderer.render(scene, camera)
  }
  if (reduce) renderer.render(scene, camera)
  tick()

  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener("resize", resize)
    window.removeEventListener("pointermove", onMove)
    document.removeEventListener("visibilitychange", onVis)
    geo.dispose()
    mat.dispose()
    silkGeo.dispose()
    ;(silkNear.material as THREE.Material).dispose()
    ;(silkFar.material as THREE.Material).dispose()
    renderer.dispose()
    renderer.domElement.remove()
  }
}
