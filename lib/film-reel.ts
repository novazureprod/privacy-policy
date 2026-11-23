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
  ctx.fillText(`${n}`, x0 + 8, yTop)
  ctx.textAlign = "right"
  ctx.fillText(`▸ ${n}A`, x0 + iw - 8, yTop)
  ctx.textAlign = "left"
  const label = title.toUpperCase()
  ctx.fillText(`${n}  ▸  ${label.length > 38 ? label.slice(0, 37) + "…" : label}`, x0 + 8, yBot)
}

// Logo Novazure en relief, au centre de la spirale : le phénix est détaché du cercle
// (obturateur doré), qui reste en arrière-plan, plus discret. Le phénix est isolé à partir
// des pixels bleu pétrole de l'image, puis ses parties dorées enclavées (N, liserés) sont
// rattachées en bouchant les trous du masque. L'épaisseur vient d'un empilement de calques.
function buildLogo(url: string): THREE.Group {
  const g = new THREE.Group()
  const HEIGHT = 2.2 // hauteur du logo dans la scène
  new THREE.ImageLoader().load(url, (img) => {
    const w = img.naturalWidth
    const h = img.naturalHeight
    const src = document.createElement("canvas")
    src.width = w
    src.height = h
    const sctx = src.getContext("2d", { willReadFrequently: true })!
    sctx.drawImage(img, 0, 0)
    const data = sctx.getImageData(0, 0, w, h).data

    // 1. Pixels du phénix : bleu pétrole (bleu et vert nettement au-dessus du rouge).
    const mask = new Uint8Array(w * h)
    for (let i = 0; i < w * h; i++) {
      const r = data[i * 4]
      const gg = data[i * 4 + 1]
      const b = data[i * 4 + 2]
      const a = data[i * 4 + 3]
      if (a > 40 && b > r + 18 && gg > r + 6) mask[i] = 1
    }
    // 2. Dilatation légère : récupère les contours sombres et les liserés dorés des plumes.
    const dilate = (m: Uint8Array, rad: number) => {
      const out = new Uint8Array(w * h)
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
          if (!m[y * w + x]) continue
          for (let dy = -rad; dy <= rad; dy++)
            for (let dx = -rad; dx <= rad; dx++) {
              const xx = x + dx
              const yy = y + dy
              if (xx >= 0 && yy >= 0 && xx < w && yy < h && dx * dx + dy * dy <= rad * rad) out[yy * w + xx] = 1
            }
        }
      return out
    }
    const grown = dilate(mask, 4)
    // 3. Bouche les trous (le N doré, l'intérieur des ailes) : tout ce qui n'est pas
    //    joignable depuis le bord sans traverser le phénix lui appartient.
    const outside = new Uint8Array(w * h)
    const stack: number[] = []
    for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x)
    for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1)
    while (stack.length) {
      const i = stack.pop()!
      if (outside[i] || grown[i]) continue
      outside[i] = 1
      const x = i % w
      const y = (i / w) | 0
      if (x > 0) stack.push(i - 1)
      if (x < w - 1) stack.push(i + 1)
      if (y > 0) stack.push(i - w)
      if (y < h - 1) stack.push(i + w)
    }
    // Les trous trop grands (zones dorées du cercle encerclées par les ailes) restent au cercle.
    const phoenix = new Uint8Array(w * h)
    const seen = new Uint8Array(w * h)
    for (let i = 0; i < w * h; i++) {
      if (grown[i]) phoenix[i] = 1
      else if (!outside[i] && !seen[i]) {
        const region: number[] = []
        const st = [i]
        while (st.length) {
          const k = st.pop()!
          if (seen[k] || grown[k] || outside[k]) continue
          seen[k] = 1
          region.push(k)
          const x = k % w
          const y = (k / w) | 0
          if (x > 0) st.push(k - 1)
          if (x < w - 1) st.push(k + 1)
          if (y > 0) st.push(k - w)
          if (y < h - 1) st.push(k + w)
        }
        if (region.length < 4000) for (const k of region) phoenix[k] = 1
      }
    }

    // 4. Parties dorées du phénix (bec, crête, serres, liserés des plumes) : ce sont de
    //    petites zones dorées, séparées du cercle par un trait sombre, collées à l'oiseau.
    //    On les rattache entières au phénix pour que la tête et le bec restent d'un bloc.
    const isGold = (i: number) => {
      const r = data[i * 4]
      const gg = data[i * 4 + 1]
      const b = data[i * 4 + 2]
      return data[i * 4 + 3] > 40 && r > 90 && r > b + 35 && gg > b + 10
    }
    const near = dilate(grown, 18) // voisinage immédiat du corps bleu
    // Seconde passe : les mèches de la crête, à quelques pixels des pièces déjà rattachées.
    for (let pass = 0; pass < 2; pass++) {
      const reach = pass === 0 ? phoenix : dilate(phoenix, 6)
      const label = new Uint8Array(w * h)
      for (let i = 0; i < w * h; i++) {
        if (label[i] || phoenix[i] || !isGold(i)) continue
        const region: number[] = []
        let touches = false
        const st = [i]
        label[i] = 1
        while (st.length) {
          const k = st.pop()!
          region.push(k)
          const x = k % w
          const y = (k / w) | 0
          const nb = [x > 0 ? k - 1 : -1, x < w - 1 ? k + 1 : -1, y > 0 ? k - w : -1, y < h - 1 ? k + w : -1]
          for (const q of nb) {
            if (q < 0) continue
            if (reach[q] && !phoenix[k]) touches = true
            if (!phoenix[q] && !label[q] && isGold(q)) {
              label[q] = 1
              st.push(q)
            }
          }
        }
        // Petites pièces (bec, crête, serres) : toujours à l'oiseau. Une pièce du cercle peut
        // le toucher mais s'étend loin de lui : on ne garde que les zones collées au corps bleu.
        let close = 0
        for (const k of region) close += near[k]
        const small = region.length < (pass === 0 ? 1800 : 800)
        const hugging = pass === 0 && region.length < 9000 && close / region.length > 0.8
        if (touches && (small || hugging)) for (const k of region) phoenix[k] = 1
      }
    }
    // Récupère le trait sombre qui entoure ces parties dorées.
    const outline = dilate(phoenix, 2)
    for (let i = 0; i < w * h; i++) {
      if (outline[i] && !phoenix[i] && !isGold(i) && data[i * 4 + 3] > 40) phoenix[i] = 1
    }

    const layer = (keep: (i: number) => boolean) => {
      const c = document.createElement("canvas")
      c.width = w
      c.height = h
      const ctx = c.getContext("2d")!
      const out = ctx.createImageData(w, h)
      for (let i = 0; i < w * h; i++) {
        if (!keep(i)) continue
        out.data.set(data.subarray(i * 4, i * 4 + 4), i * 4)
      }
      ctx.putImageData(out, 0, 0)
      const t = new THREE.CanvasTexture(c)
      t.colorSpace = THREE.SRGBColorSpace
      return t
    }
    const bird = layer((i) => phoenix[i] === 1)
    const ring = layer((i) => phoenix[i] === 0 && data[i * 4 + 3] > 0)
    const W = (HEIGHT * w) / h
    const plane = new THREE.PlaneGeometry(W, HEIGHT)
    // Empilement : la face avant en couleurs, les calques derrière assombris forment la tranche.
    const stackOf = (tex: THREE.Texture, z: number, depth: number, layers: number, light: number, opacity: number) => {
      for (let k = layers; k >= 0; k--) {
        const front = k === 0
        const mat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          alphaTest: 0.4,
          opacity,
          depthWrite: true,
          side: THREE.DoubleSide,
        })
        mat.color.setScalar(front ? light : light * (0.28 + 0.2 * (1 - k / layers)))
        const m = new THREE.Mesh(plane, mat)
        m.position.z = z - (k / layers) * depth
        g.add(m)
      }
    }
    stackOf(ring, -0.35, 0.08, 6, 0.62, 0.85) // cercle : en retrait, plus sombre, mais bien présent
    stackOf(bird, 0.25, 0.18, 14, 1, 1) // phénix : détaché vers l'avant, plus épais
  })
  return g
}

// La bande reste immobile et ne défile qu'avec le défilement de la page : `track` est
// l'élément haut que l'on fait défiler (le conteneur reste collé à l'écran pendant ce temps).
export function mountFilmReel(
  container: HTMLElement,
  items: ReelItem[],
  onSelect: (item: ReelItem) => void,
  track: HTMLElement = container,
  logoUrl = "/logo/logo-mark.png",
) {
  const n = items.length
  const L = n * FRAME_L
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  container.appendChild(renderer.domElement)
  renderer.domElement.style.cssText = "display:block;width:100%;height:100%"
  renderer.domElement.style.touchAction = "auto"

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
  const logo3d = buildLogo(logoUrl)
  rig.add(logo3d)

  // Spirale elliptique autour d'un axe vertical : devant l'appareil, la bande file à
  // l'horizontale d'un bord à l'autre de l'écran, puis repasse derrière en montant.
  // A (demi-largeur), B (profondeur) et le pas sont recalculés selon le format d'écran.
  let A = 4.6
  let B = 1.9
  let pitch = FILM_H + 0.45
  let perim = 1
  let height = 1
  let shift = 0 // décale la spirale pour laisser le centre (le logo) entre deux passages de la bande
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
    // Passages avant de la bande : y = (k + 0.5) * pitch - height / 2. On les cale à ±pitch/2.
    const y0 = 0.5 * pitch - height / 2
    shift = (((pitch / 2 - y0) % pitch) + pitch) % pitch
    if (shift > pitch / 2) shift -= pitch
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
    out.set(A * Math.cos(th), (s / perim) * pitch - height / 2 + shift, B * Math.sin(th))
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
    pitch = FILM_H + (vertical ? 1.5 : 2.1)
    B = vertical ? 1.5 : 1.9
    // La largeur seule fixe la distance : la bande avant déborde des deux bords, les
    // vignettes restent grandes, et la spirale dépasse en haut et en bas de l'écran.
    A = vertical ? 1.55 : 3.4
    B = vertical ? 1.3 : 1.7
    buildPath()
    const dist = (A * 2 * 0.8) / (2 * t * cam.aspect) + B
    rig.rotation.set(0.16, 0, vertical ? 0 : -0.05)
    cam.position.set(0, 0.35, dist)
    cam.lookAt(0, 0, 0)
    cam.updateProjectionMatrix()
    logo3d.scale.setScalar(vertical ? 0.62 : 1)
  }
  layout()
  const ro = new ResizeObserver(layout)
  ro.observe(container)

  let offset = 0
  let hovered = -1
  // Position de défilement de `track`, de 0 (début) à 1 (fin) : elle fait avancer la bande.
  const progress = () => {
    const r = track.getBoundingClientRect()
    const run = r.height - window.innerHeight
    const x = run > 40 ? -r.top / run : (window.innerHeight - r.top) / (window.innerHeight + r.height)
    return Math.min(1, Math.max(0, x))
  }
  const travel = () => L - FRAME_L * 3 // toutes les vignettes passent devant
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
      const lum = facing > 0 ? 0.55 + 0.45 * facing : 0.16
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
  let downX = 0
  let downY = 0
  const onDown = (e: PointerEvent) => {
    downX = e.clientX
    downY = e.clientY
  }
  const onMove = (e: PointerEvent) => {
    hovered = pick(e)
    el.style.cursor = hovered >= 0 ? "pointer" : "default"
  }
  const onUp = (e: PointerEvent) => {
    if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 8) return
    const i = pick(e)
    if (i >= 0) onSelect(items[i])
  }
  const onLeave = () => {
    hovered = -1
  }
  el.addEventListener("pointerdown", onDown)
  el.addEventListener("pointermove", onMove)
  el.addEventListener("pointerup", onUp)
  el.addEventListener("pointerleave", onLeave)

  offset = progress() * travel()
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
    // Suit le défilement en douceur ; sans défilement, rien ne bouge.
    const goal = progress() * travel()
    offset += (goal - offset) * (reduce ? 1 : Math.min(1, dt * 7))
    // Le logo pivote à peine avec le défilement : on voit le phénix se détacher du cercle.
    const pr = progress()
    logo3d.rotation.y = (pr - 0.5) * 0.7
    logo3d.rotation.x = -0.12
    update()
    renderer.render(scene, cam)
  }
  raf = requestAnimationFrame(tick)

  return () => {
    cancelAnimationFrame(raf)
    ro.disconnect()
    io.disconnect()
    el.removeEventListener("pointerdown", onDown)
    el.removeEventListener("pointermove", onMove)
    el.removeEventListener("pointerup", onUp)
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
