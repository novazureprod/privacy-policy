// Pellicule photo 3D : une bande noire continue, perforée en haut et en bas, avec les
// numéros de cadre orange, qui s'enroule en spirale autour d'un appareil photo et
// traverse tout l'écran. Chaque vignette est un cadre de la bande ; un clic l'ouvre.
// Écrit en three.js « nu » pour servir à la fois au site Next.js et à l'aperçu statique.
import * as THREE from "three"

export type ReelItem = { id: string; image: string; title: string }

const IMG_W = 1.6 // largeur de l'image d'un cadre (16:9)
const IMG_H = 0.9
const BAND = 0.21 // bande perforée, en haut et en bas
const FILM_H = IMG_H + BAND * 2
const GAP = 0.14 // pellicule noire entre deux images
const FRAME_L = IMG_W + GAP
const SEGS = 18 // découpage de chaque cadre pour qu'il épouse la courbe
const PX = 420 // pixels de texture par unité

function drawFrame(ctx: CanvasRenderingContext2D, img: HTMLImageElement | null, n: number, title: string) {
  const W = ctx.canvas.width
  const H = ctx.canvas.height
  const band = BAND * PX
  ctx.fillStyle = "#0b0b0c"
  ctx.fillRect(0, 0, W, H)
  // Image, recadrée pour remplir la fenêtre du cadre
  const x0 = (GAP / 2) * PX
  const iw = IMG_W * PX
  const ih = IMG_H * PX
  if (img && img.naturalWidth) {
    const s = Math.max(iw / img.naturalWidth, ih / img.naturalHeight)
    const sw = iw / s
    const sh = ih / s
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(x0, band, iw, ih, 10)
    ctx.clip()
    ctx.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, x0, band, iw, ih)
    ctx.restore()
  } else {
    ctx.fillStyle = "#16181d"
    ctx.fillRect(x0, band, iw, ih)
  }
  // Perforations claires, régulières, en haut et en bas
  const holeW = 0.075 * PX
  const holeH = 0.1 * PX
  const pitch = FRAME_L / 8
  ctx.fillStyle = "#e9e4da"
  for (let k = 0; k < 8; k++) {
    const hx = (k + 0.5) * pitch * PX - holeW / 2
    for (const hy of [band * 0.22, H - band * 0.22 - holeH]) {
      ctx.beginPath()
      ctx.roundRect(hx, hy, holeW, holeH, 6)
      ctx.fill()
    }
  }
  // Marquages orange, comme sur une vraie pellicule
  ctx.fillStyle = "#f08a24"
  ctx.textBaseline = "middle"
  ctx.font = `700 ${Math.round(band * 0.36)}px "Open Sans", Arial, sans-serif`
  const yTop = band * 0.78
  const yBot = H - band * 0.78
  ctx.textAlign = "left"
  ctx.fillText(`NOVAZURE 400   ${n}`, x0 + 8, yTop)
  ctx.textAlign = "right"
  ctx.fillText(`▸ ${n}A`, x0 + iw - 8, yTop)
  ctx.textAlign = "left"
  const label = title.toUpperCase()
  ctx.fillText(`${n}  ▸  ${label.length > 38 ? label.slice(0, 37) + "…" : label}`, x0 + 8, yBot)
}

function buildCamera(): THREE.Group {
  const g = new THREE.Group()
  const body = new THREE.MeshStandardMaterial({ color: 0x1b2535, metalness: 0.75, roughness: 0.32 })
  const dark = new THREE.MeshStandardMaterial({ color: 0x0b0d12, metalness: 0.5, roughness: 0.5 })
  const gold = new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 0.95, roughness: 0.25 })
  const glass = new THREE.MeshStandardMaterial({ color: 0x0a1a3a, metalness: 0.2, roughness: 0.05, emissive: 0x112244, emissiveIntensity: 0.6 })
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, rx = 0) => {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, z)
    m.rotation.x = rx
    g.add(m)
    return m
  }
  add(new THREE.BoxGeometry(1.7, 1.0, 0.7), body, 0, 0, 0)
  add(new THREE.BoxGeometry(1.72, 0.16, 0.72), dark, 0, -0.42, 0) // grip bas
  add(new THREE.BoxGeometry(0.6, 0.32, 0.5), body, -0.05, 0.62, 0) // viseur
  add(new THREE.BoxGeometry(0.22, 0.1, 0.22), gold, 0.55, 0.55, 0.1) // déclencheur
  add(new THREE.CylinderGeometry(0.42, 0.42, 0.18, 48), gold, 0, 0, 0.44, Math.PI / 2) // bague
  add(new THREE.CylinderGeometry(0.38, 0.4, 0.55, 48), dark, 0, 0, 0.7, Math.PI / 2) // fût
  add(new THREE.CylinderGeometry(0.4, 0.4, 0.06, 48), gold, 0, 0, 0.98, Math.PI / 2)
  add(new THREE.CylinderGeometry(0.3, 0.3, 0.02, 48), glass, 0, 0, 1.0, Math.PI / 2) // lentille
  const flashRing = add(new THREE.TorusGeometry(0.13, 0.025, 12, 36), gold, 0.6, 0.25, 0.36)
  flashRing.rotation.x = 0
  return g
}

export function mountFilmReel(container: HTMLElement, items: ReelItem[], onSelect: (item: ReelItem) => void) {
  const n = items.length
  const L = n * FRAME_L
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  container.appendChild(renderer.domElement)
  renderer.domElement.style.cssText = "display:block;width:100%;height:100%"
  renderer.domElement.style.touchAction = "pan-y"

  const scene = new THREE.Scene()
  const cam = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
  scene.add(new THREE.AmbientLight(0x8fa6c8, 0.9))
  const key = new THREE.DirectionalLight(0xffffff, 2.2)
  key.position.set(3, 5, 6)
  scene.add(key)
  const rim = new THREE.PointLight(0xc9a227, 12, 12)
  rim.position.set(-2.5, -1.5, 2.5)
  scene.add(rim)

  const rig = new THREE.Group() // incline l'ensemble pour la perspective
  scene.add(rig)
  const camera3d = buildCamera()
  rig.add(camera3d)

  // Spirale elliptique autour d'un axe vertical : devant l'appareil, la bande file à
  // l'horizontale d'un bord à l'autre de l'écran, puis repasse derrière en montant.
  // A (demi-largeur), B (profondeur) et le pas sont recalculés selon le format d'écran.
  let A = 4.6
  let B = 1.9
  let pitch = FILM_H + 0.45
  let perim = 1
  let height = 1
  const TABLE = 720
  const arc = new Float32Array(TABLE + 1) // longueur cumulée sur un tour, pour un pas régulier
  const buildPath = () => {
    arc[0] = 0
    let px = A * Math.cos(-Math.PI / 2)
    let pz = B * Math.sin(-Math.PI / 2)
    for (let k = 1; k <= TABLE; k++) {
      const th = -Math.PI / 2 + (k / TABLE) * 2 * Math.PI
      const x = A * Math.cos(th)
      const z = B * Math.sin(th)
      arc[k] = arc[k - 1] + Math.hypot(x - px, z - pz)
      px = x
      pz = z
    }
    perim = arc[TABLE]
    height = (L / perim) * pitch
  }
  const thetaAt = (s: number) => {
    const turns = Math.floor(s / perim)
    const r = s - turns * perim
    let lo = 0
    let hi = TABLE
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1
      if (arc[mid] < r) lo = mid
      else hi = mid
    }
    const f = (r - arc[lo]) / Math.max(1e-6, arc[hi] - arc[lo])
    // départ (et raccord de la boucle) derrière l'appareil
    return -Math.PI / 2 + ((lo + f) / TABLE) * 2 * Math.PI + turns * 2 * Math.PI
  }

  const p = new THREE.Vector3()
  const nrm = new THREE.Vector3()
  const tan = new THREE.Vector3()
  const wid = new THREE.Vector3()
  const q = new THREE.Vector3()
  const place = (s: number, out: THREE.Vector3) => {
    const th = thetaAt(s)
    out.set(A * Math.cos(th), (s / perim) * pitch - height / 2, B * Math.sin(th))
    return th
  }
  const pointAt = (s: number, out: THREE.Vector3, normal: THREE.Vector3, tangent: THREE.Vector3) => {
    const th = place(s, out)
    normal.set(B * Math.cos(th), 0, A * Math.sin(th)).normalize()
    place(s + 0.01, q)
    tangent.copy(q).sub(out).normalize()
  }

  const loader = new THREE.ImageLoader()
  const frames = items.map((it, i) => {
    const canvas = document.createElement("canvas")
    canvas.width = Math.round(FRAME_L * PX)
    canvas.height = Math.round(FILM_H * PX)
    const ctx = canvas.getContext("2d")!
    drawFrame(ctx, null, i + 1, it.title)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy()
    loader.load(it.image, (img) => {
      drawFrame(ctx, img, i + 1, it.title)
      tex.needsUpdate = true
    })
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array((SEGS + 1) * 2 * 3)
    const uv = new Float32Array((SEGS + 1) * 2 * 2)
    const idx: number[] = []
    for (let j = 0; j <= SEGS; j++) {
      uv.set([1 - j / SEGS, 1, 1 - j / SEGS, 0], j * 4) // lu à l'endroit sur la face avant
      if (j < SEGS) {
        const a = j * 2
        idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
      }
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3))
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2))
    geo.setIndex(idx)
    const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, transparent: true })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.userData.index = i
    mesh.frustumCulled = false
    rig.add(mesh)
    return { mesh, geo, mat, tex }
  })

  // Mise en page : la boucle avant dépasse un peu des bords (la bande traverse l'écran),
  // et toute la hauteur de la spirale reste visible. Plus de tours sur téléphone.
  let vertical = false
  const toCam = new THREE.Vector3()
  const layout = () => {
    const w = container.clientWidth
    const h = container.clientHeight
    renderer.setSize(w, h, false)
    cam.aspect = w / h
    vertical = cam.aspect < 0.85
    const t = Math.tan(((cam.fov * Math.PI) / 180) / 2)
    pitch = FILM_H + (vertical ? 0.45 : 0.85)
    B = vertical ? 1.5 : 1.9
    // Essais successifs : la largeur fixe la distance, la hauteur peut la repousser.
    A = vertical ? 2.2 : 4.6
    let dist = 10
    for (let k = 0; k < 4; k++) {
      buildPath()
      const dW = (A * 2 * 0.78) / (2 * t * cam.aspect) // bande avant légèrement plus large que l'écran
      const dH = (height + FILM_H + 0.6) / (2 * t)
      dist = Math.max(dW, dH) + B
      if (dH > dW) A = Math.min(A * 1.2, (dist - B) * t * cam.aspect * 1.3)
    }
    buildPath()
    rig.rotation.set(0.16, 0, vertical ? 0 : -0.05)
    cam.position.set(0, 0.35, dist)
    cam.lookAt(0, 0, 0)
    cam.updateProjectionMatrix()
    camera3d.scale.setScalar(vertical ? 0.95 : 1.35)
  }
  layout()
  const ro = new ResizeObserver(layout)
  ro.observe(container)

  let offset = 0
  const speed = reduce ? 0 : 0.32 // unités par seconde
  let target = speed
  let dragging = false
  let lastX = 0
  let lastY = 0
  let moved = 0
  let fling = 0
  let hovered = -1
  const camWorld = new THREE.Vector3()

  const update = () => {
    rig.updateMatrixWorld()
    camWorld.copy(cam.position)
    rig.worldToLocal(camWorld)
    for (let i = 0; i < n; i++) {
      const f = frames[i]
      const s0 = (((i * FRAME_L + offset) % L) + L) % L
      const arr = f.geo.attributes.position.array as Float32Array
      for (let j = 0; j <= SEGS; j++) {
        pointAt(s0 + (j / SEGS) * FRAME_L, p, nrm, tan)
        wid.crossVectors(tan, nrm).normalize().multiplyScalar(FILM_H / 2)
        arr[j * 6] = p.x + wid.x
        arr[j * 6 + 1] = p.y + wid.y
        arr[j * 6 + 2] = p.z + wid.z
        arr[j * 6 + 3] = p.x - wid.x
        arr[j * 6 + 4] = p.y - wid.y
        arr[j * 6 + 5] = p.z - wid.z
      }
      f.geo.attributes.position.needsUpdate = true
      f.geo.computeBoundingSphere()
      // Ombre douce : la face tournée vers nous est claire, l'arrière plus sombre.
      pointAt(s0 + FRAME_L / 2, p, nrm, tan)
      toCam.copy(camWorld).sub(p).normalize()
      const facing = nrm.dot(toCam)
      const lum = facing > 0 ? 0.55 + 0.45 * facing : 0.28
      const hi = i === hovered ? 1.12 : 1
      f.mat.color.setScalar(Math.min(1, lum * hi))
      // Fondu aux deux bouts de la bande (hors champ), là où elle reboucle.
      const mid = s0 + FRAME_L / 2
      const edge = Math.min(mid, L - mid) / (FRAME_L * 1.5)
      f.mat.opacity = Math.max(0, Math.min(1, edge))
      f.mesh.renderOrder = Math.round(facing * 10)
    }
  }

  const ray = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  const pick = (e: PointerEvent | MouseEvent) => {
    const r = renderer.domElement.getBoundingClientRect()
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ndc, cam)
    const hit = ray.intersectObjects(frames.map((f) => f.mesh), false)[0]
    return hit ? (hit.object.userData.index as number) : -1
  }

  const el = renderer.domElement
  const onDown = (e: PointerEvent) => {
    dragging = true
    moved = 0
    lastX = e.clientX
    lastY = e.clientY
    fling = 0
  }
  const onMove = (e: PointerEvent) => {
    if (dragging) {
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      if (e.pointerType === "touch" && Math.abs(dy) > Math.abs(dx)) return // laisse défiler la page
      const d = -dx * 0.012
      offset += d
      fling = d * 60
      moved += Math.abs(dx) + Math.abs(dy)
      lastX = e.clientX
      lastY = e.clientY
      return
    }
    hovered = pick(e)
    el.style.cursor = hovered >= 0 ? "pointer" : "grab"
    target = hovered >= 0 ? speed * 0.15 : speed
  }
  const onUp = (e: PointerEvent) => {
    if (dragging && moved < 6) {
      const i = pick(e)
      if (i >= 0) onSelect(items[i])
    }
    dragging = false
  }
  const onLeave = () => {
    hovered = -1
    target = speed
  }
  el.addEventListener("pointerdown", onDown)
  window.addEventListener("pointermove", onMove)
  window.addEventListener("pointerup", onUp)
  el.addEventListener("pointerleave", onLeave)

  let cur = speed
  let last = performance.now()
  let raf = 0
  let visible = true
  const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting))
  io.observe(container)
  const tick = (now: number) => {
    raf = requestAnimationFrame(tick)
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    if (!visible) return
    if (!dragging) {
      cur += (target - cur) * Math.min(1, dt * 4)
      offset += (cur + fling) * dt
      fling *= Math.pow(0.05, dt)
    }
    camera3d.rotation.y = -0.65 + Math.sin(now / 4000) * 0.3
    camera3d.rotation.x = Math.sin(now / 5200) * 0.08
    update()
    renderer.render(scene, cam)
  }
  raf = requestAnimationFrame(tick)

  return () => {
    cancelAnimationFrame(raf)
    ro.disconnect()
    io.disconnect()
    el.removeEventListener("pointerdown", onDown)
    window.removeEventListener("pointermove", onMove)
    window.removeEventListener("pointerup", onUp)
    el.removeEventListener("pointerleave", onLeave)
    frames.forEach((f) => {
      f.geo.dispose()
      f.mat.dispose()
      f.tex.dispose()
    })
    renderer.dispose()
    el.remove()
  }
}
