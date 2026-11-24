// Fond « vagues de poussière d'or » en WebGL (three.js), d'après l'image de référence de Novazure.
// Composition en tiers :
// - tiers du haut : vide et sombre (quelques rares grains seulement) ;
// - tiers du milieu : une vague lointaine floue (bleue à gauche, or à droite), puis la vague
//   principale, proche et nette, dont la crête dorée remonte sur la droite ;
// - tiers du bas : une petite vague tout devant, mi-floue mi-nette, et de gros bokehs.
// La profondeur de champ est calculée dans le shader : plus un grain est loin du plan net
// (la vague principale), plus il est gros, doux et pâle.
import * as THREE from "three"

const COMMON = /* glsl */ `
  uniform float uTime;
  uniform float uHalfW;   // demi-largeur visible à la profondeur de la vague
  uniform float uYOff;    // hauteur de la vague
  uniform float uAmp;     // force des courbes
  uniform float uZ;       // profondeur de la vague
  float crest(float x, float z, float t) {
    float s = x / uHalfW;
    // Dunes : un creux profond au centre, une remontée ample à droite, et des ondulations
    // irrégulières (fréquences sans rapport entre elles, décalées pour chaque vague).
    float ph = uYOff * 3.7;
    return uYOff + uAmp * (
        - 0.32 * exp(-pow((s + 0.05) * 1.35, 2.0))     // creux central marqué
        + 0.62 * smoothstep(0.25, 1.15, s)             // remontée ample sur la droite
        + 0.10 * (1.0 - smoothstep(-1.2, -0.4, s))     // léger rebord à gauche
        + 0.075 * sin(0.9 * x + t * 0.22 + ph)
        + 0.045 * sin(2.3 * x - t * 0.17 + ph * 1.9 + z)
        + 0.015 * sin(5.1 * x + t * 0.31 + z * 1.7));
  }
`

const VERT = /* glsl */ `
  uniform float uScale;
  uniform float uFocus;
  uniform float uKind;    // 0 : vague, 1 : poussière libre et bokeh
  attribute vec4 aSeed;   // x : position, y : écart sous la crête, z : profondeur, w : aléa
  attribute vec3 aColor;
  attribute float aLayer; // vague : 0 corps, 1 sable de l'arête ; libre : 0 poussière, 1 bokeh
  varying vec3 vColor;
  varying float vBlur;
  varying float vAlpha;
  ${COMMON}

  void main() {
    float t = uTime;
    float x = aSeed.x * uHalfW;
    float d = aSeed.y;
    float z = aSeed.z;
    float w = aSeed.w;
    float fade = 1.0;
    vec3 p;
    if (uKind < 0.5) {
      // Les grains sous la crête descendent et se rapprochent de la caméra.
      p = vec3(x, crest(x, z, t) - d, uZ + z + d * 1.2);
    } else if (aLayer < 0.5) {
      // Poussière libre : monte lentement en boucle, avec un balancement aléatoire.
      float y = -1.75 + mod(d * 3.6 + t * (0.018 + w * 0.03), 3.6);
      p = vec3(x + sin(t * (0.15 + w * 0.2) + w * 40.0) * 0.12 + sin(t * 0.07 + w * 9.0) * 0.06, y, z);
      fade = smoothstep(-1.75, -1.4, y);
    } else {
      // Gros bokeh tout en bas.
      p = vec3(x + 0.05 * sin(t * 0.15 + w * 6.28), -1.5 + d * 0.35 + 0.04 * sin(t * 0.2 + w * 12.0), 1.6 + z);
      fade = 0.8;
    }
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // Tiers du haut vide : presque rien au-dessus du tiers supérieur de l'écran.
    float ndcY = gl_Position.y / gl_Position.w;
    fade *= 1.0 - 0.95 * smoothstep(0.2, 0.42, ndcY);

    // Cercle de confusion : distance au plan net (la vague principale).
    float coc = abs(-mv.z - uFocus);
    vBlur = clamp(coc * 0.8, 0.0, 1.0);
    float base = uKind > 0.5 ? (aLayer > 0.5 ? 2.4 : 0.7 + w * 1.4) : (aLayer > 0.5 ? 0.38 : 0.55 + w * 0.9);
    gl_PointSize = base * (1.0 + min(coc, 1.4) * 5.0) * uScale / -mv.z;

    float twinkle = 0.7 + 0.3 * sin(t * (1.0 + w * 3.0) + w * 40.0);
    vAlpha = twinkle * fade / (1.0 + coc * coc * 3.5);
    if (uKind < 0.5 && aLayer > 0.5) vAlpha *= 1.3;
    if (aColor.b > aColor.r) vAlpha *= 0.6; // la trame bleue reste discrète, l'or porte la lumière
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

// Ruban de soie qui suit l'arête d'une vague : liseré lumineux + voile translucide.
const SILK_VERT = /* glsl */ `
  varying vec2 vUv;
  varying float vS;
  varying float vNdcY;
  ${COMMON}
  void main() {
    vUv = uv;
    float x = position.x * uHalfW;
    vS = x / uHalfW;
    vec3 p = vec3(x, crest(x, 0.0, uTime) - uv.y * 0.55 + 0.004, uZ + uv.y * 0.4);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    vNdcY = gl_Position.y / gl_Position.w;
  }
`
const SILK_FRAG = /* glsl */ `
  uniform float uLine;    // finesse et force du liseré (0 : voile seulement)
  uniform float uGlow;    // intensité générale
  varying vec2 vUv;
  varying float vS;
  varying float vNdcY;
  void main() {
    float v = vUv.y;
    float sides = smoothstep(-1.2, -0.85, vS) * (1.0 - smoothstep(1.05, 1.2, vS));
    float line = uLine > 0.0 ? exp(-v * uLine) * 0.75 : 0.0;
    // Voile de satin : bande bleue lumineuse sous la crête, qui se dissipe vers le bas.
    float glow = line + exp(-v * 4.5) * 0.35 + exp(-v * 1.4) * 0.08;
    vec3 col = mix(vec3(0.16, 0.46, 1.0), vec3(1.0, 0.72, 0.26), smoothstep(0.15, 0.85, vS));
    float top = 1.0 - 0.9 * smoothstep(0.25, 0.45, vNdcY);
    gl_FragColor = vec4(col, glow * sides * uGlow * top);
  }
`

const GOLD = [new THREE.Color("#f59e0b"), new THREE.Color("#fbbf24"), new THREE.Color("#fef08a")]
const BLUE = [new THREE.Color("#1e62d0"), new THREE.Color("#3b82f6")]
const pick = (arr: THREE.Color[]) => arr[(Math.random() * arr.length) | 0]

type Wave = { yOff: number; z: number; amp: number; body: number; sand: number; depth: number; line: number; glow: number }

export function mountDustWaves(container: HTMLElement) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const small = window.innerWidth < 700
  const k = small ? 0.6 : 1

  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" })
  const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2)
  renderer.setPixelRatio(dpr)
  renderer.setClearColor(0x000000, 0)
  container.appendChild(renderer.domElement)
  renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block"

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50)
  camera.position.set(0, 0, 4)

  const shared = { uTime: { value: 0 }, uScale: { value: 1 }, uFocus: { value: 4 } }
  const disposables: { dispose(): void }[] = []
  const halfWs: { u: { value: number }; z: number }[] = []

  const makePoints = (count: number, fill: (put: (s: number[], c: THREE.Color, l: number) => void) => void, extra: Record<string, { value: number }>) => {
    const seed = new Float32Array(count * 4)
    const color = new Float32Array(count * 3)
    const layer = new Float32Array(count)
    let n = 0
    fill((s, c, l) => {
      seed.set(s, n * 4)
      color.set([c.r, c.g, c.b], n * 3)
      layer[n] = l
      n++
    })
    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3))
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 4))
    geo.setAttribute("aColor", new THREE.BufferAttribute(color, 3))
    geo.setAttribute("aLayer", new THREE.BufferAttribute(layer, 1))
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 30)
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: { ...shared, ...extra },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const pts = new THREE.Points(geo, mat)
    pts.frustumCulled = false
    scene.add(pts)
    disposables.push(geo, mat)
  }

  const span = () => (Math.random() * 2 - 1) * 1.15 // en fraction de demi-largeur d'écran

  const addWave = (wv: Wave) => {
    const uHalfW = { value: 2.5 }
    halfWs.push({ u: uHalfW, z: wv.z })
    const u = { uHalfW, uYOff: { value: wv.yOff }, uAmp: { value: wv.amp }, uZ: { value: wv.z }, uKind: { value: 0 } }
    const body = Math.round(wv.body * k)
    const sand = Math.round(wv.sand * k)
    makePoints(body + sand, (put) => {
      for (let i = 0; i < body; i++) {
        const s = span()
        const d = Math.pow(Math.random(), 5) * wv.depth
        const right = THREE.MathUtils.smoothstep(s, 0.1, 0.95)
        const goldChance = d > wv.depth * 0.25 ? 0.85 : 0.3 + right * 0.65
        put([s, d, (Math.random() - 0.5) * 0.2, Math.random()], Math.random() < goldChance ? pick(GOLD) : pick(BLUE), 0)
      }
      for (let i = 0; i < sand; i++) {
        const s = span()
        const right = THREE.MathUtils.smoothstep(s, 0.15, 0.9)
        put([s, Math.pow(Math.random(), 2) * 0.018, (Math.random() - 0.5) * 0.06, Math.random()], Math.random() < 0.15 + right * 0.8 ? pick(GOLD) : pick(BLUE), 1)
      }
    }, u)
    // Ruban de soie de cette vague
    const silkGeo = new THREE.PlaneGeometry(2.4, 1, 260, 120)
    silkGeo.translate(0, 0.5, 0) // uv.y = 0 sur la crête, 1 en bas
    const silkMat = new THREE.ShaderMaterial({
      vertexShader: SILK_VERT,
      fragmentShader: SILK_FRAG,
      uniforms: { ...shared, ...u, uLine: { value: wv.line }, uGlow: { value: wv.glow } },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide, // le ruban est retourné (il descend sous la crête)
      blending: THREE.AdditiveBlending,
    })
    const silk = new THREE.Mesh(silkGeo, silkMat)
    silk.frustumCulled = false
    silk.renderOrder = -1
    scene.add(silk)
    disposables.push(silkGeo, silkMat)
  }

  // Vague lointaine, floue (milieu, au fond) ; vague principale, nette ; petite vague tout devant.
  addWave({ yOff: 0.55, z: -2.2, amp: 1.1, body: 700, sand: 0, depth: 0.6, line: 0, glow: 0.4 })
  addWave({ yOff: -0.25, z: 0, amp: 1.25, body: 3800, sand: 3200, depth: 1.0, line: 34, glow: 0.95 })
  addWave({ yOff: -0.85, z: 1.15, amp: 0.6, body: 450, sand: 0, depth: 0.25, line: 0, glow: 0.5 })

  // Poussière libre qui flotte, et gros bokeh du premier plan
  {
    const uHalfW = { value: 2.5 }
    halfWs.push({ u: uHalfW, z: 0 })
    const free = Math.round(380 * k)
    const bokeh = Math.round(160 * k)
    makePoints(free + bokeh, (put) => {
      for (let i = 0; i < free; i++) {
        const z = Math.random() < 0.7 ? (Math.random() - 0.5) * 1.6 : 0.8 + Math.random() * 1.2
        put([span(), Math.random(), z, Math.random()], Math.random() < 0.9 ? pick(GOLD) : pick(BLUE), 0)
      }
      for (let i = 0; i < bokeh; i++) {
        put([span() * 0.6, Math.random(), Math.random() * 0.8, Math.random()], Math.random() < 0.75 ? pick(GOLD) : pick(BLUE), 1)
      }
    }, { uHalfW, uYOff: { value: 0 }, uAmp: { value: 1 }, uZ: { value: 0 }, uKind: { value: 1 } })
  }

  const resize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.position.z = w / h < 0.8 ? 5.2 : 4
    shared.uFocus.value = camera.position.z
    camera.updateProjectionMatrix()
    const tan = Math.tan((camera.fov * Math.PI) / 360)
    // Chaque vague couvre toute la largeur visible à sa propre profondeur.
    for (const hw of halfWs) hw.u.value = tan * (camera.position.z - hw.z) * camera.aspect
    shared.uScale.value = h * dpr * 0.012
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
    if (!reduce) shared.uTime.value += dt
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
    disposables.forEach((d) => d.dispose())
    renderer.dispose()
    renderer.domElement.remove()
  }
}
