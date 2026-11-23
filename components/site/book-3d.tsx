"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { PORTFOLIO_VIDEOS, youtubeEmbed } from "@/lib/portfolio"
import type * as T from "three"

/*
 * Livre « Nos réalisations » en vraie 3D (Three.js).
 * - Double page posée sur une table en bois, tranche des feuilles, reliure.
 * - Chaque feuille est un maillage déformable : pendant le tournage, le papier se courbe
 *   et ondule comme un journal, avec une légère bombe au centre.
 * - Textures de papier, de cuir et de bois générées à l'écran.
 * - Clic sur la page de droite : page suivante, ou ouverture de la vidéo sur les pages vidéo.
 * Les vidéos YouTube s'ouvrent dans une fenêtre (un lecteur ne peut pas être dessiné sur une page 3D).
 */

const PAGE_W = 1
const PAGE_H = 0.72
const SEG = 42 // découpage le long de la courbe (PC)
const ROWS = 4 // découpage sur la hauteur (pour la bombe du papier)
const TURN_MS = 1500
// Tracé de chemins désactivé : il a besoin d'un fond pour le rendu, et le livre flotte désormais sans décor.
const PT_ENABLED = false
const STAGGER_MS = 110

// Pages : P0 titre (intérieur de couverture), P1 sommaire, puis info / vue pour chaque vidéo, P10 fin.
type PageDef = { kind: "title" | "contents" | "info" | "thumb" | "end"; video?: number }
const PAGES: PageDef[] = [
  { kind: "title" },
  { kind: "contents" },
  ...PORTFOLIO_VIDEOS.flatMap((_, v): PageDef[] => [
    { kind: "info", video: v },
    { kind: "thumb", video: v },
  ]),
  { kind: "end" },
]
const LEAVES = Math.floor(PAGES.length / 2) + 1 // couverture + feuilles intérieures
const FLIPS = LEAVES // f = nombre de feuilles tournées : 0 fermé, LEAVES dernière page

// Page affichée à gauche et à droite après f tournages
function spread(f: number) {
  const left = f >= 1 ? PAGES[2 * f - 2] : null
  const right = f < LEAVES ? PAGES[2 * f - 1] ?? null : null
  return { left, right }
}

function makeNoise(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number, seed = 1) {
  const img = ctx.getImageData(0, 0, w, h)
  let s = seed * 9301 + 49297
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (rnd() - 0.5) * amount
    img.data[i] += n
    img.data[i + 1] += n
    img.data[i + 2] += n
  }
  ctx.putImageData(img, 0, 0)
}

function paperCanvas(w: number, h: number, color = "#efe8d8") {
  const c = document.createElement("canvas")
  c.width = w
  c.height = h
  const ctx = c.getContext("2d")!
  ctx.fillStyle = color
  ctx.fillRect(0, 0, w, h)
  makeNoise(ctx, w, h, 10, 3)
  // fibres
  ctx.globalAlpha = 0.05
  for (let i = 0; i < 260; i++) {
    ctx.strokeStyle = Math.random() < 0.5 ? "#8a7f6a" : "#ffffff"
    ctx.beginPath()
    const x = Math.random() * w
    const y = Math.random() * h
    ctx.moveTo(x, y)
    ctx.lineTo(x + (Math.random() - 0.5) * 60, y + (Math.random() - 0.5) * 6)
    ctx.stroke()
  }
  ctx.globalAlpha = 1
  return c
}

function drawPage(page: PageDef | null, thumb: HTMLImageElement | null): HTMLCanvasElement {
  const W = 1024
  const H = Math.round(W * PAGE_H)
  if (!page) return paperCanvas(W, H)
  const c = paperCanvas(W, H)
  const ctx = c.getContext("2d")!
  ctx.fillStyle = "#1a2233"
  ctx.textBaseline = "alphabetic"
  const pad = 90
  if (page.kind === "title") {
    ctx.font = "300 30px 'Cooper Hewitt', system-ui, sans-serif"
    ctx.fillStyle = "#8a6d14"
    ctx.fillText("NOVAZURE", pad, pad + 20)
    ctx.font = "800 96px 'Open Sans', system-ui, sans-serif"
    ctx.fillStyle = "#14203a"
    ctx.fillText("Réalisations", pad, H / 2 + 20)
    ctx.font = "300 28px 'Cooper Hewitt', system-ui, sans-serif"
    ctx.fillStyle = "#5a6578"
    ctx.fillText("Vidéos choisies, à feuilleter", pad, H / 2 + 80)
  } else if (page.kind === "contents") {
    ctx.font = "300 30px 'Cooper Hewitt', system-ui, sans-serif"
    ctx.fillStyle = "#8a6d14"
    ctx.fillText("SOMMAIRE", pad, pad + 20)
    PORTFOLIO_VIDEOS.forEach((v, k) => {
      const y = 230 + k * 110
      ctx.font = "300 26px 'Cooper Hewitt', system-ui, sans-serif"
      ctx.fillStyle = "#8a93a3"
      ctx.fillText(String(k + 1).padStart(2, "0"), pad, y)
      ctx.font = "600 44px 'PT Sans', system-ui, sans-serif"
      ctx.fillStyle = "#14203a"
      ctx.fillText(v.title, pad + 90, y)
      ctx.strokeStyle = "rgba(20,32,58,.18)"
      ctx.setLineDash([3, 6])
      ctx.beginPath()
      ctx.moveTo(pad + 90 + ctx.measureText(v.title).width + 20, y - 12)
      ctx.lineTo(W - pad, y - 12)
      ctx.stroke()
      ctx.setLineDash([])
    })
  } else if (page.kind === "info" && page.video !== undefined) {
    const v = PORTFOLIO_VIDEOS[page.video]
    ctx.font = "300 26px 'Cooper Hewitt', system-ui, sans-serif"
    ctx.fillStyle = "#8a6d14"
    ctx.fillText(`RÉALISATION ${String(page.video + 1).padStart(2, "0")}`, pad, pad + 20)
    ctx.font = "800 70px 'Open Sans', system-ui, sans-serif"
    ctx.fillStyle = "#14203a"
    ctx.fillText(v.title, pad, H / 2 + 10)
    ctx.font = "400 30px 'PT Sans', system-ui, sans-serif"
    ctx.fillStyle = "#4a5568"
    ctx.fillText("Cliquez la page de droite pour ouvrir la vidéo.", pad, H / 2 + 80)
    ctx.font = "300 24px 'Cooper Hewitt', system-ui, sans-serif"
    ctx.fillStyle = "#8a6d14"
    ctx.fillText("VOIR SUR YOUTUBE", pad, H - pad)
  } else if (page.kind === "thumb" && page.video !== undefined) {
    const m = 60
    const x = m
    const y = m
    const w = W - 2 * m
    const h = H - 2 * m
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, 18)
    ctx.clip()
    if (thumb) {
      // recadrage « cover » de la miniature
      const r = Math.max(w / thumb.naturalWidth, h / thumb.naturalHeight)
      const dw = thumb.naturalWidth * r
      const dh = thumb.naturalHeight * r
      ctx.drawImage(thumb, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh)
    } else {
      const g = ctx.createLinearGradient(x, y, x + w, y + h)
      g.addColorStop(0, "#1b2535")
      g.addColorStop(1, "#5b7db1")
      ctx.fillStyle = g
      ctx.fillRect(x, y, w, h)
    }
    // voile sombre bas + bouton lecture
    const shade = ctx.createLinearGradient(0, y + h * 0.55, 0, y + h)
    shade.addColorStop(0, "rgba(0,0,0,0)")
    shade.addColorStop(1, "rgba(0,0,0,.75)")
    ctx.fillStyle = shade
    ctx.fillRect(x, y, w, h)
    ctx.fillStyle = "rgba(255,255,255,.9)"
    ctx.beginPath()
    ctx.arc(x + w / 2, y + h / 2, 56, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "#14203a"
    ctx.beginPath()
    ctx.moveTo(x + w / 2 - 16, y + h / 2 - 26)
    ctx.lineTo(x + w / 2 + 26, y + h / 2)
    ctx.lineTo(x + w / 2 - 16, y + h / 2 + 26)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
    ctx.font = "600 34px 'Open Sans', system-ui, sans-serif"
    ctx.fillStyle = "#ffffff"
    ctx.fillText(PORTFOLIO_VIDEOS[page.video].title, x + 28, y + h - 30)
  } else if (page.kind === "end") {
    ctx.font = "800 84px 'Open Sans', system-ui, sans-serif"
    ctx.fillStyle = "#14203a"
    ctx.textAlign = "center"
    ctx.fillText("Fin", W / 2, H / 2)
    ctx.font = "300 26px 'Cooper Hewitt', system-ui, sans-serif"
    ctx.fillStyle = "#8a6d14"
    ctx.fillText("NOVAZURE", W / 2, H / 2 + 60)
  }
  return c
}

function coverCanvas(): HTMLCanvasElement {
  const W = 1024
  const H = Math.round(W * PAGE_H)
  const c = document.createElement("canvas")
  c.width = W
  c.height = H
  const ctx = c.getContext("2d")!
  const g = ctx.createLinearGradient(0, 0, W, H)
  g.addColorStop(0, "#1b2a47")
  g.addColorStop(1, "#0b1020")
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
  makeNoise(ctx, W, H, 18, 7)
  ctx.strokeStyle = "rgba(201,162,39,.7)"
  ctx.lineWidth = 6
  ctx.strokeRect(40, 40, W - 80, H - 80)
  ctx.textAlign = "center"
  ctx.fillStyle = "#c9a227"
  ctx.font = "300 28px 'Cooper Hewitt', system-ui, sans-serif"
  ctx.fillText("NOVAZURE", W / 2, H / 2 - 70)
  ctx.font = "800 84px 'Open Sans', system-ui, sans-serif"
  ctx.fillStyle = "#e9dcb0"
  ctx.fillText("Réalisations", W / 2, H / 2 + 20)
  return c
}

function leatherCanvas(): HTMLCanvasElement {
  const S = 1024
  const c = document.createElement("canvas")
  c.width = S
  c.height = S
  const ctx = c.getContext("2d")!
  ctx.fillStyle = "#17171a"
  ctx.fillRect(0, 0, S, S)
  makeNoise(ctx, S, S, 40, 31)
  ctx.globalAlpha = 0.08
  for (let i = 0; i < 2500; i++) {
    ctx.fillStyle = Math.random() < 0.5 ? "#000" : "#3a3a40"
    ctx.fillRect(Math.random() * S, Math.random() * S, 2, 2)
  }
  ctx.globalAlpha = 1
  return c
}

function woodCanvas(): HTMLCanvasElement {
  const S = 1024
  const c = document.createElement("canvas")
  c.width = S
  c.height = S
  const ctx = c.getContext("2d")!
  ctx.fillStyle = "#1e1813"
  ctx.fillRect(0, 0, S, S)
  for (let i = 0; i < 180; i++) {
    const y = Math.random() * S
    ctx.strokeStyle = `rgba(${Math.random() < 0.5 ? "0,0,0" : "120,90,60"},${0.04 + Math.random() * 0.08})`
    ctx.lineWidth = 1 + Math.random() * 3
    ctx.beginPath()
    ctx.moveTo(0, y)
    for (let x = 0; x <= S; x += 64) ctx.lineTo(x, y + Math.sin(x / 90 + i) * 4)
    ctx.stroke()
  }
  makeNoise(ctx, S, S, 14, 11)
  return c
}

function bumpCanvas(): HTMLCanvasElement {
  const S = 512
  const c = document.createElement("canvas")
  c.width = S
  c.height = S
  const ctx = c.getContext("2d")!
  ctx.fillStyle = "#808080"
  ctx.fillRect(0, 0, S, S)
  makeNoise(ctx, S, S, 60, 21)
  ctx.globalAlpha = 0.25
  for (let i = 0; i < 400; i++) {
    ctx.strokeStyle = Math.random() < 0.5 ? "#a0a0a0" : "#606060"
    ctx.beginPath()
    const x = Math.random() * S
    const y = Math.random() * S
    ctx.moveTo(x, y)
    ctx.lineTo(x + (Math.random() - 0.5) * 40, y + (Math.random() - 0.5) * 3)
    ctx.stroke()
  }
  ctx.globalAlpha = 1
  return c
}

function edgeCanvas(): HTMLCanvasElement {
  const c = document.createElement("canvas")
  c.width = 256
  c.height = 256
  const ctx = c.getContext("2d")!
  ctx.fillStyle = "#e6dfcc"
  ctx.fillRect(0, 0, 256, 256)
  for (let y = 0; y < 256; y += 3) {
    ctx.fillStyle = y % 6 === 0 ? "rgba(120,105,80,.35)" : "rgba(255,255,255,.2)"
    ctx.fillRect(0, y, 256, 1)
  }
  return c
}

export function Book3D() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [f, setF] = useState(0)
  const fRef = useRef(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const api = useRef<{ go: (to: number) => void; ready: boolean }>({ go: () => {}, ready: false })

  useEffect(() => {
    const el = mountRef.current
    if (!el) return
    let disposed = false
    let cleanup = () => {}

    ;(async () => {
      const THREE = await import("three")
      if (disposed) return

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      let scene_env: T.Texture | null = null
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.05
      el.appendChild(renderer.domElement)
      renderer.domElement.style.width = "100%"
      renderer.domElement.style.height = "100%"
      renderer.domElement.style.display = "block"
      renderer.domElement.setAttribute("aria-label", "Livre des réalisations")

      // Éclairage d'environnement réaliste (studio) : reflets et lumière indirecte
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js")
      const pmrem = new THREE.PMREMGenerator(renderer)
      const envScene = new RoomEnvironment()
      scene_env = pmrem.fromScene(envScene, 0.04).texture
      envScene.dispose()

      const scene = new THREE.Scene()
      // scene.environment = scene_env
      scene.environmentIntensity = 0.25
      const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50)

      // Lumière : une lampe au-dessus à gauche, une lumière de remplissage douce
      const key = new THREE.DirectionalLight(0xffe2b0, 3.2)
      key.position.set(-1.6, 4.4, 1.2)
      key.castShadow = true
      key.shadow.mapSize.set(2048, 2048)
      key.shadow.camera.left = -2.6
      key.shadow.camera.right = 2.6
      key.shadow.camera.top = 2.2
      key.shadow.camera.bottom = -2.2
      key.shadow.bias = -0.0004
      key.shadow.radius = 10
      key.shadow.blurSamples = 16
      scene.add(key)
      scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x1a120c, 0.7))
      const fill = new THREE.DirectionalLight(0x9db8ff, 0.5)
      fill.position.set(2.5, 2, -1.5)
      scene.add(fill)

      // Sol invisible : ne reçoit que l'ombre du livre, pour qu'il paraisse suspendu sans décor
      const shadowFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(12, 12),
        new THREE.ShadowMaterial({ opacity: 0.55 }),
      )
      shadowFloor.rotation.x = -Math.PI / 2
      shadowFloor.position.y = -0.35
      shadowFloor.receiveShadow = true
      scene.add(shadowFloor)

      // Planche de couverture et tranches des pages
      const leather = new THREE.MeshStandardMaterial({ color: 0x131d33, roughness: 0.7 })
      const board = new THREE.Mesh(new THREE.BoxGeometry(2 * PAGE_W + 0.14, 0.03, PAGE_H + 0.12), leather)
      board.position.set(0, -0.015, 0)
      board.castShadow = true
      board.receiveShadow = true
      scene.add(board)

      const edgeTex = new THREE.CanvasTexture(edgeCanvas())
      edgeTex.colorSpace = THREE.SRGBColorSpace
      edgeTex.wrapS = edgeTex.wrapT = THREE.RepeatWrapping
      edgeTex.repeat.set(4, 1)
      const edgeMat = new THREE.MeshStandardMaterial({ map: edgeTex, roughness: 0.95 })
      const blockH = 0.04
      for (const sx of [-1, 1]) {
        const block = new THREE.Mesh(new THREE.BoxGeometry(PAGE_W * 0.985, blockH, PAGE_H * 0.96), edgeMat)
        block.position.set(sx * PAGE_W * 0.5, blockH / 2 + 0.004, 0)
        block.castShadow = true
        block.receiveShadow = true
        scene.add(block)
      }

      // Textures des faces
      const coverTex = new THREE.CanvasTexture(coverCanvas())
      coverTex.colorSpace = THREE.SRGBColorSpace
      // Couverture : texture PBR réelle (couleur, normales, rugosité) de l'asset « binder notebook » 4K (CC0)
      const texLoader = new THREE.TextureLoader()
      const pbr = (f: string, srgb: boolean) => {
        const t = texLoader.load(f)
        if (srgb) t.colorSpace = THREE.SRGBColorSpace
        t.wrapS = t.wrapT = THREE.RepeatWrapping
        t.anisotropy = 8
        return t
      }
      const coverMat = new THREE.MeshPhysicalMaterial({
        map: pbr("/textures/binder/diffuse.jpg", true),
        normalMap: pbr("/textures/binder/normal.jpg", false),
        roughnessMap: pbr("/textures/binder/rough.jpg", false),
        roughness: 1,
        normalScale: new THREE.Vector2(0.6, 0.6),
        clearcoat: 0.15,
        clearcoatRoughness: 0.4,
      })

      const paperBump = new THREE.CanvasTexture(bumpCanvas())
      paperBump.wrapS = paperBump.wrapT = THREE.RepeatWrapping
      paperBump.repeat.set(1.5, 1.5)
      const thumbImgs: (HTMLImageElement | null)[] = PORTFOLIO_VIDEOS.map(() => null)
      const faceTex: T.CanvasTexture[] = []
      const repaint = (idx: number) => {
        const p = PAGES[idx]
        const t = p && p.kind === "thumb" && p.video !== undefined ? thumbImgs[p.video] : null
        const c = drawPage(p ?? null, t)
        const tex = faceTex[idx]
        tex.dispose() // force la réallocation GPU à la bonne taille
        tex.image = c
        tex.needsUpdate = true
      }
      PAGES.forEach((_, idx) => {
        const t = new THREE.CanvasTexture(document.createElement("canvas"))
        t.colorSpace = THREE.SRGBColorSpace
        t.anisotropy = 4
        faceTex.push(t)
      })
      const fontsReady = (document as Document & { fonts?: FontFaceSet }).fonts?.ready ?? Promise.resolve()
      await fontsReady
      if (disposed) return
      PAGES.forEach((_, idx) => repaint(idx))
      // miniatures YouTube : chargées si accessibles, sinon un dégradé reste affiché
      PORTFOLIO_VIDEOS.forEach((v, k) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          thumbImgs[k] = img
          const idx = PAGES.findIndex((p) => p.kind === "thumb" && p.video === k)
          if (idx >= 0) repaint(idx)
        }
        img.src = `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`
      })

      // Feuilles déformables
      type Leaf = {
        j: number
        mesh: T.Mesh
        pos: T.BufferAttribute
        nor: T.BufferAttribute
        theta: number
        from: number
        to: number
        t0: number
        delay: number
        moving: boolean
        dragging: boolean
      }
      const nSeg = SEG + 1
      const nRow = ROWS + 1
      const nVert = nSeg * nRow
      const leaves: Leaf[] = []
      const idx = (i: number, k: number) => i * nRow + k

      for (let j = 0; j < LEAVES; j++) {
        const geo = new THREE.BufferGeometry()
        const pos = new Float32Array(nVert * 2 * 3)
        const nor = new Float32Array(nVert * 2 * 3)
        const uv = new Float32Array(nVert * 2 * 2)
        // face avant (indices 0..nVert-1) puis face arrière (nVert..2nVert-1)
        for (let i = 0; i < nSeg; i++) {
          for (let k = 0; k < nRow; k++) {
            const u = i / SEG
            const v = k / ROWS
            const a = idx(i, k)
            uv[2 * a] = u
            uv[2 * a + 1] = 1 - v
            const b = a + nVert
            uv[2 * b] = 1 - u
            uv[2 * b + 1] = 1 - v
          }
        }
        const index: number[] = []
        for (let i = 0; i < SEG; i++) {
          for (let k = 0; k < ROWS; k++) {
            const a = idx(i, k), b = idx(i, k + 1), c = idx(i + 1, k), d = idx(i + 1, k + 1)
            // face avant : normale vers le haut
            index.push(a, b, c, c, b, d)
          }
        }
        const frontCount = index.length
        for (let i = 0; i < SEG; i++) {
          for (let k = 0; k < ROWS; k++) {
            const a = idx(i, k) + nVert, b = idx(i, k + 1) + nVert, c = idx(i + 1, k) + nVert, d = idx(i + 1, k + 1) + nVert
            index.push(a, c, b, c, d, b)
          }
        }
        geo.setIndex(index)
        geo.addGroup(0, frontCount, 0)
        geo.addGroup(frontCount, index.length - frontCount, 1)
        const posAttr = new THREE.BufferAttribute(pos, 3)
        const norAttr = new THREE.BufferAttribute(nor, 3)
        geo.setAttribute("position", posAttr)
        geo.setAttribute("normal", norAttr)
        geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2))

        const frontMat = j === 0 ? coverMat : new THREE.MeshStandardMaterial({ map: faceTex[2 * j - 1] ?? null, bumpMap: paperBump, bumpScale: 0.6, roughness: 0.88, metalness: 0 })
        const backMat = new THREE.MeshStandardMaterial({ map: faceTex[2 * j] ?? null, bumpMap: paperBump, bumpScale: 0.6, roughness: 0.88, metalness: 0 })
        const mesh = new THREE.Mesh(geo, [frontMat, backMat])
        mesh.castShadow = true
        mesh.receiveShadow = true
        scene.add(mesh)
        leaves.push({ j, mesh, pos: posAttr, nor: norAttr, theta: 0, from: 0, to: 0, t0: 0, delay: 0, moving: false, dragging: false })
      }

      // Pages : tranche et textures liées (mise à jour quand la texture change)
      // Courbe d'une feuille pour un angle θ : l'arête libre prend du retard, ce qui courbe le papier
      const tmpX = new Float64Array(nSeg)
      const tmpY = new Float64Array(nSeg)
      const tmpPhi = new Float64Array(nSeg)
      function shapeLeaf(leaf: Leaf, theta: number, layerY: number) {
        const flex = leaf.j === 0 ? 0 : 0.34 * Math.sin(theta) // couverture rigide, papier souple
        const ds = PAGE_W / SEG
        let x = 0, y = 0
        for (let i = 0; i < nSeg; i++) {
          const s = i / SEG
          const phi = theta * (1 - flex * s)
          tmpPhi[i] = phi
          tmpX[i] = x
          tmpY[i] = y
          const phiMid = theta * (1 - flex * Math.min(1, (i + 0.5) / SEG))
          x += Math.cos(phiMid) * ds
          y += Math.sin(phiMid) * ds
        }
        const cupAmt = 0.035 * Math.sin(theta)
        for (let i = 0; i < nSeg; i++) {
          const tx = Math.cos(tmpPhi[i])
          const ty = Math.sin(tmpPhi[i])
          for (let k = 0; k < nRow; k++) {
            const v = k / ROWS
            const cup = cupAmt * Math.sin(Math.PI * v)
            const a = idx(i, k)
            const px = tmpX[i]
            const dip = leaf.j === 0 ? 0 : -0.012 * Math.exp(-Math.pow(tmpX[i] / 0.1, 2)) // creux de reliure
            const py = tmpY[i] + layerY + cup + dip
            const pz = (v - 0.5) * PAGE_H
            leaf.pos.setXYZ(a, px, py, pz)
            leaf.pos.setXYZ(a + nVert, px, py, pz)
            // normale de la face avant : perpendiculaire à la tangente, dans le plan de courbure
            leaf.nor.setXYZ(a, -ty, tx, 0)
            leaf.nor.setXYZ(a + nVert, ty, -tx, 0)
          }
        }
        leaf.pos.needsUpdate = true
        leaf.nor.needsUpdate = true
      }

      const BASE_Y = 0.046
      const LAYER = 0.0012
      function layerFor(leaf: Leaf, moving: boolean) {
        const flipped = leaf.theta > Math.PI / 2
        let y = BASE_Y + (flipped ? leaf.j : LEAVES - leaf.j) * LAYER
        if (moving) y += 0.03
        return y
      }
      leaves.forEach((l) => shapeLeaf(l, 0, layerFor(l, false)))

      // Animation : chaque feuille passe de 0 à π (ou inversement) avec un léger décalage
      const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
      let animating = false
      const go = (to: number) => {
        const from = fRef.current
        if (to === from) return
        fRef.current = to
        setF(to)
        const now = performance.now()
        const forward = to > from
        const lo = Math.min(from, to)
        const hi = Math.max(from, to)
        let order = 0
        leaves.forEach((l) => {
          // feuille j passe d'un côté à l'autre quand f traverse j
          const crosses = forward ? l.j >= from && l.j < to : l.j >= to && l.j < from
          if (!crosses) return
          l.from = forward ? 0 : Math.PI
          l.to = forward ? Math.PI : 0
          l.t0 = now + (reduce ? 0 : order * STAGGER_MS)
          l.delay = reduce ? 0 : order * STAGGER_MS
          l.moving = true
          order++
        })
        void lo; void hi
        animating = true
        if (reduce) {
          leaves.forEach((l) => { if (l.moving) { l.theta = l.to; l.moving = false } })
        }
      }
      api.current = { go, ready: true }

      // Clic : droite = suivant (ou vidéo), gauche = précédent, fermé = ouvrir
      const raycaster = new THREE.Raycaster()
      const pointer = new THREE.Vector2()
      // Glisser : la feuille suit le curseur, puis se pose ou revient selon la distance parcourue
      let suppressClick = false
      const drag = { active: false, moved: false, startX: 0, sideRight: true, leaf: null as Leaf | null, dir: 1, prog: 0 }
      const pick = (clientX: number, clientY: number) => {
        const r = renderer.domElement.getBoundingClientRect()
        pointer.x = ((clientX - r.left) / r.width) * 2 - 1
        pointer.y = -((clientY - r.top) / r.height) * 2 + 1
        raycaster.setFromCamera(pointer, camera)
        return raycaster.intersectObjects(leaves.map((l) => l.mesh), false)
      }
      const onDown = (e: PointerEvent) => {
        if (fRef.current === 0) return
        drag.active = true
        drag.moved = false
        drag.startX = e.clientX
        const hits = pick(e.clientX, e.clientY)
        drag.sideRight = !hits.length || hits[0].point.x >= 0
      }
      const onMove = (e: PointerEvent) => {
        if (!drag.active) return
        const dx = e.clientX - drag.startX
        if (!drag.moved) {
          if (Math.abs(dx) < 8) return
          drag.moved = true
          const cur = fRef.current
          if (drag.sideRight && cur < LEAVES) {
            drag.dir = 1
            drag.leaf = leaves[cur]
          } else if (!drag.sideRight && cur > 0) {
            drag.dir = -1
            drag.leaf = leaves[cur - 1]
          } else {
            drag.leaf = null
          }
          if (drag.leaf) {
            drag.leaf.moving = true
            drag.leaf.dragging = true
            animating = true
          }
        }
        if (!drag.leaf) return
        const span = renderer.domElement.getBoundingClientRect().width * 0.42
        const prog = Math.min(1, Math.max(0, drag.dir === 1 ? -dx / span : dx / span))
        drag.prog = prog
        drag.leaf.theta = drag.dir === 1 ? Math.PI * prog : Math.PI * (1 - prog)
      }
      const onUp = () => {
        if (!drag.active) return
        drag.active = false
        const L = drag.leaf
        if (!L) return
        const commit = drag.prog > 0.45
        const cur = fRef.current
        L.dragging = false
        L.from = L.theta
        L.t0 = performance.now()
        L.moving = true
        animating = true
        if (commit) {
          L.to = drag.dir === 1 ? Math.PI : 0
          const target = drag.dir === 1 ? cur + 1 : cur - 1
          fRef.current = target
          setF(target)
        } else {
          L.to = drag.dir === 1 ? 0 : Math.PI
        }
        if (drag.moved) suppressClick = true
        drag.leaf = null
      }
      renderer.domElement.addEventListener("pointerdown", onDown)
      renderer.domElement.addEventListener("pointermove", onMove)
      window.addEventListener("pointerup", onUp)

      const onClick = (e: MouseEvent) => {
        if (suppressClick) {
          suppressClick = false
          return
        }
        const r = renderer.domElement.getBoundingClientRect()
        pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1
        pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1
        raycaster.setFromCamera(pointer, camera)
        const hits = raycaster.intersectObjects(leaves.map((l) => l.mesh), false)
        const cur = fRef.current
        if (cur === 0) return go(1)
        if (!hits.length) return
        const x = hits[0].point.x
        if (x >= 0) {
          const rightPage = cur < LEAVES ? PAGES[2 * cur - 1] : null
          if (rightPage && rightPage.kind === "thumb" && rightPage.video !== undefined) {
            setLightbox(rightPage.video)
            return
          }
          if (cur < LEAVES) go(cur + 1)
        } else if (cur > 0) {
          go(cur - 1)
        }
      }
      renderer.domElement.addEventListener("click", onClick)
      renderer.domElement.style.cursor = "pointer"

      // Tracé de chemins : une fois le livre posé, l'image s'affine jusqu'au photoréalisme
      const { WebGLPathTracer } = await import("three-gpu-pathtracer")
      const pathTracer: any = new WebGLPathTracer(renderer)
      pathTracer.bounces = 5
      pathTracer.filterGlossyFactor = 0.25
      pathTracer.tiles.set(2, 2)
      let ptOn = false
      let settle = 0

      // Caméra : vue légèrement en plongée, qui s'adapte à la largeur
      const fit = () => {
        const w = el.clientWidth
        const h = el.clientHeight
        renderer.setSize(w, h, false)
        if (pathTracer) pathTracer.reset()
        camera.aspect = w / h
        const narrow = w / h < 1.2
        camera.fov = narrow ? 34 : 26
        const dist = narrow ? 4.1 : 3.75
        camera.position.set(0, dist * 0.92, dist * 0.6)
        camera.lookAt(0, 0.02, 0)
        camera.updateProjectionMatrix()
      }
      fit()
      const ro = new ResizeObserver(fit)
      ro.observe(el)

      let raf = 0
      const frame = () => {
        raf = requestAnimationFrame(frame)
        const now = performance.now()
        const busy = animating || drag.active
        if (busy) {
          settle = 0
          if (ptOn) ptOn = false
        } else {
          settle++
          if (PT_ENABLED && !ptOn && settle > 30) {
            pathTracer.setScene(scene, camera)
            ptOn = true
          }
        }
        if (ptOn) {
          pathTracer.renderSample()
          return
        }
        if (animating) {
          let any = false
          for (const l of leaves) {
            if (!l.moving || l.dragging) continue
            const t = Math.min(1, Math.max(0, (now - l.t0) / TURN_MS))
            l.theta = l.from + (l.to - l.from) * ease(t)
            if (t >= 1) { l.theta = l.to; l.moving = false }
            else any = true
          }
          animating = any || leaves.some((l) => l.moving)
        }
        for (const l of leaves) {
          // on recalcule la feuille seulement quand elle bouge, ou à l'arrêt pour la pile
          const moving = l.moving
          const target = layerFor(l, moving)
          if (moving || l.mesh.userData.y !== target || l.mesh.userData.theta !== l.theta) {
            shapeLeaf(l, l.theta, target)
            l.mesh.userData.y = target
            l.mesh.userData.theta = l.theta
          }
        }
        renderer.render(scene, camera)
      }
      frame()

      cleanup = () => {
        cancelAnimationFrame(raf)
        ro.disconnect()
        renderer.domElement.removeEventListener("click", onClick)
        renderer.domElement.removeEventListener("pointerdown", onDown)
        renderer.domElement.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerup", onUp)
        scene.traverse((o: T.Object3D) => {
          const m = o as T.Mesh
          if (m.geometry) m.geometry.dispose()
          const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : []
          mats.forEach((mat: T.Material) => {
            const mm = mat as T.MeshStandardMaterial
            mm.map?.dispose()
            mm.dispose()
          })
        })
        renderer.dispose()
        renderer.domElement.remove()
      }
    })()

    return () => {
      disposed = true
      cleanup()
    }
  }, [])

  const n = PORTFOLIO_VIDEOS.length
  const next = () => api.current.go(Math.min(LEAVES, fRef.current + 1))
  const prev = () => api.current.go(Math.max(0, fRef.current - 1))
  const current = spread(f)
  const label =
    f === 0 ? "Fermé" : f >= LEAVES ? "Fin" : current.right?.kind === "thumb" ? `Réalisation ${current.right.video! + 1} / ${n}` : "Feuilletez"

  return (
    <div className="relative mx-auto w-full max-w-4xl select-none">
      <div ref={mountRef} className="relative aspect-[4/3] w-full sm:aspect-[16/10]" />

      <div className="mt-6 flex items-center justify-center gap-4">
        <button type="button" onClick={prev} disabled={f === 0} aria-label="Page précédente" className="glass glass-gold grid h-11 w-11 place-items-center rounded-full disabled:opacity-30">
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <span className="font-sub text-xs tracking-[0.2em] text-[var(--nz-muted)]">{label}</span>
        <button type="button" onClick={next} disabled={f >= LEAVES} aria-label="Page suivante" className="glass glass-gold grid h-11 w-11 place-items-center rounded-full disabled:opacity-30">
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {lightbox !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" role="dialog" aria-modal="true" aria-label={PORTFOLIO_VIDEOS[lightbox].title}>
          <button type="button" onClick={() => setLightbox(null)} aria-label="Fermer la vidéo" className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="aspect-video w-full max-w-4xl overflow-hidden rounded-xl bg-black">
            <iframe
              className="h-full w-full"
              src={youtubeEmbed(PORTFOLIO_VIDEOS[lightbox].youtubeId) + "&autoplay=1"}
              title={PORTFOLIO_VIDEOS[lightbox].title}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  )
}
