// Fond « vagues de poussière d'or » en WebGL (three.js), d'après l'image de référence de Novazure.
// - Une vague principale basse et douce (tiers inférieur), qui ne remonte que sur le bord droit.
// - Une arête de « sable » ultra-fin et un ruban de soie lumineux (bleu au centre, or à droite).
// - Une poussière d'or libre qui se détache et flotte lentement vers le haut.
// - Une vraie profondeur de champ : tout ce qui s'éloigne de la crête grossit et devient flou.
// Le haut et le centre de l'écran restent sombres pour que le texte reste lisible.
import * as THREE from "three"

// Crête de la vague, partagée par les particules et le ruban. s = position relative (-1 bord gauche, 1 bord droit).
const CREST = /* glsl */ `
  uniform float uHalfW;
  float crest(float x, float z, float t) {
    float s = x / uHalfW;
    return -1.14
      - 0.12 * (1.0 - s * s)                 // creux doux et étiré au centre
      + 0.45 * smoothstep(0.35, 1.1, s)      // remontée élégante, seulement sur le bord droit
      + 0.035 * sin(1.6 * x + t * 0.30 + z)
      + 0.012 * sin(4.1 * x - t * 0.25 + z * 1.7);
  }
`

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uScale;
  uniform float uFocus;
  attribute vec4 aSeed;     // x : position, y : écart / hauteur, z : profondeur, w : aléa
  attribute vec3 aColor;
  attribute float aLayer;   // 0 vague, 1 vague lointaine, 2 bokeh avant, 3 sable de la crête, 4 poussière libre
  varying vec3 vColor;
  varying float vBlur;
  varying float vAlpha;
  ${CREST}

  void main() {
    float t = uTime;
    float x = aSeed.x * uHalfW;
    float d = aSeed.y;
    float z = aSeed.z;
    float w = aSeed.w;
    float fade = 1.0;
    vec3 p;
    if (aLayer < 0.5) {
      // Corps de la vague : sous la crête, les grains descendent et se rapprochent de la caméra.
      p = vec3(x, crest(x, z, t) - d, z + d * 1.4);
    } else if (aLayer < 1.5) {
      // Vague lointaine, haute, diffuse et très discrète.
      p = vec3(x, 1.35 + 0.08 * sin(1.4 * x + t * 0.2) - d * 0.5, -2.6 + z);
      fade = 0.35;
    } else if (aLayer < 2.5) {
      // Gros bokeh du premier plan, tout en bas.
      p = vec3(x + 0.05 * sin(t * 0.15 + w * 6.28), -1.55 + d * 0.4 + 0.04 * sin(t * 0.2 + w * 12.0), 2.2 + z);
      fade = 0.8;
    } else if (aLayer < 3.5) {
      // Arête de la vague : sable ultra-fin, très dense.
      p = vec3(x, crest(x, z, t) - d, z);
    } else {
      // Poussière libre : monte lentement en boucle, avec un balancement aléatoire.
      float y = -1.75 + mod(d * 3.6 + t * (0.018 + w * 0.03), 3.6);
      float px = x + sin(t * (0.15 + w * 0.2) + w * 40.0) * 0.12 + sin(t * 0.07 + w * 9.0) * 0.06;
      p = vec3(px, y, z);
      // Rare en haut et au centre (zone du texte), apparaît en douceur au bas de la boucle.
      fade = (1.0 - 0.9 * smoothstep(-0.8, 0.5, y)) * smoothstep(-1.75, -1.4, y);
    }
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // Cercle de confusion : distance au plan net (la crête).
    float coc = abs(-mv.z - uFocus);
    vBlur = clamp(coc * 0.9, 0.0, 1.0);
    float base = aLayer > 3.5 ? (0.7 + w * 1.4) : aLayer > 2.5 ? 0.38 : aLayer > 1.5 ? 2.6 : (0.55 + w * 0.9);
    gl_PointSize = base * (1.0 + coc * 6.0) * uScale / -mv.z;

    float twinkle = 0.7 + 0.3 * sin(t * (1.0 + w * 3.0) + w * 40.0);
    vAlpha = twinkle * fade / (1.0 + coc * coc * 14.0);
    if (aLayer > 2.5 && aLayer < 3.5) vAlpha *= 1.3;
    if (aColor.b > aColor.r && aLayer < 2.5) vAlpha *= 0.6; // la trame bleue reste discrète
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
    // Grain net : disque dur ; grain flou : disque doux, un peu plus clair au bord (bokeh).
    float edge = mix(0.12, 0.6, vBlur);
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

  const counts = small
    ? { main: 4500, far: 400, front: 120, sand: 3000, free: 300 }
    : { main: 7500, far: 700, front: 200, sand: 5000, free: 450 }
  const total = counts.main + counts.far + counts.front + counts.sand + counts.free
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
  const span = () => (Math.random() * 2 - 1) * 1.15 // en fraction de demi-largeur d'écran

  for (let i = 0; i < counts.main; i++) {
    const s = span()
    const d = Math.pow(Math.random(), 4) * 0.75 // très dense sous la crête, clairsemé plus bas
    const right = THREE.MathUtils.smoothstep(s, 0.1, 0.95)
    const goldChance = d > 0.2 ? 0.85 : 0.3 + right * 0.65
    put([s, d, (Math.random() - 0.5) * 0.2, Math.random()], Math.random() < goldChance ? pick(GOLD) : pick(BLUE), 0)
  }
  for (let i = 0; i < counts.sand; i++) {
    const s = span()
    const right = THREE.MathUtils.smoothstep(s, 0.15, 0.9)
    // Sable de l'arête : bleu électrique au centre, or intense sur la droite.
    put([s, Math.pow(Math.random(), 2) * 0.018, (Math.random() - 0.5) * 0.06, Math.random()], Math.random() < 0.15 + right * 0.8 ? pick(GOLD) : pick(BLUE), 3)
  }
  for (let i = 0; i < counts.far; i++) {
    const s = span() * 1.4
    const right = THREE.MathUtils.smoothstep(s, -0.2, 1.2)
    put([s, Math.pow(Math.random(), 2) * 0.5, (Math.random() - 0.5) * 0.6, Math.random()], Math.random() < right ? pick(GOLD) : pick(BLUE), 1)
  }
  for (let i = 0; i < counts.front; i++) {
    put([span() * 0.55, Math.random(), Math.random() * 0.8, Math.random()], Math.random() < 0.75 ? pick(GOLD) : pick(BLUE), 2)
  }
  for (let i = 0; i < counts.free; i++) {
    // Profondeurs variées : minuscules et nettes au loin, grosses et floues au premier plan.
    const z = Math.random() < 0.7 ? (Math.random() - 0.5) * 1.6 : 1 + Math.random() * 1.4
    put([span(), Math.random(), z, Math.random()], Math.random() < 0.9 ? pick(GOLD) : pick(BLUE), 4)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(total * 3), 3))
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 4))
  geo.setAttribute("aColor", new THREE.BufferAttribute(color, 3))
  geo.setAttribute("aLayer", new THREE.BufferAttribute(layer, 1))
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20)

  const uniforms = { uTime: { value: 0 }, uScale: { value: 1 }, uFocus: { value: 4 }, uHalfW: { value: 2.5 } }
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

  // Rubans de soie : un liseré très fin et lumineux sur l'arête (bleu au centre, or à droite)
  // avec un voile translucide dessous, et un halo bleu diffus tout en haut.
  const silkMat = (far: boolean) =>
    new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      // Le ruban est retourné (il descend sous la crête) : on dessine les deux faces.
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        uniform float uTime;
        varying vec2 vUv;
        varying float vS;
        ${CREST}
        void main() {
          vUv = uv;
          float x = position.x * uHalfW;
          vS = x / uHalfW;
          float t = uTime;
          vec3 p;
          if (${far ? "true" : "false"}) {
            p = vec3(x, 1.9 + 0.08 * sin(1.4 * x + t * 0.2) - uv.y * 1.6, -2.6);
          } else {
            p = vec3(x, crest(x, 0.0, t) - uv.y * 0.55 + 0.004, uv.y * 0.45);
          }
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec2 vUv;
        varying float vS;
        void main() {
          float v = vUv.y;
          float sides = smoothstep(-1.2, -0.85, vS) * (1.0 - smoothstep(1.05, 1.2, vS));
          vec3 blue = vec3(0.16, 0.46, 1.0);
          vec3 gold = vec3(1.0, 0.72, 0.26);
          ${
            far
              ? "float glow = pow(sin(v * 3.14159), 2.0); vec3 col = mix(blue, gold, smoothstep(0.2, 1.1, vS) * 0.5); float a = glow * 0.05;"
              : "float line = exp(-v * 28.0); float veil = exp(-v * 5.0); float mist = exp(-v * 1.6); float glow = line * 0.75 + veil * 0.4 + mist * 0.1; vec3 col = mix(blue, gold, smoothstep(0.15, 0.85, vS)); float a = glow;"
          }
          gl_FragColor = vec4(col, a * sides);
        }
      `,
    })
  const silkGeo = new THREE.PlaneGeometry(2.4, 1, 260, 120)
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
    // Demi-largeur visible au plan de la vague : la crête est placée en proportion de l'écran.
    uniforms.uHalfW.value = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z * camera.aspect
    uniforms.uScale.value = h * dpr * 0.012
  }
  resize()
  window.addEventListener("resize", resize)

  // Parallaxe très légère à la souris
  const target = new THREE.Vector2()
  const onMove = (e: PointerEvent) => {
    target.set((e.clientX / window.innerWidth - 0.5) * 0.14, -(e.clientY / window.innerHeight - 0.5) * 0.08)
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
