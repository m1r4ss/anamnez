// Открытка в стиле медкарты (как «итоги года»): рисуем на canvas, отдаём в системное «Поделиться»
import { goal } from './goals.js'

const W = 1080, H = 1920
const INK = '#14161B', BODY = '#3E434D', MUTED = '#A0A5AF', BLUE = '#3B4FE0', OR = '#E0672E'

const rr = (ctx, x, y, w, h, r) => {
  ctx.beginPath()
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath()
}
const blob = (ctx, x, y, r, stops) => {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r)
  stops.forEach(([p, c]) => g.addColorStop(p, c))
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2)
}
const spaced = (ctx, text, x, y, sp) => { for (const ch of text) { ctx.fillText(ch, x, y); x += ctx.measureText(ch).width + sp } return x }
const wrap = (ctx, text, maxW) => {
  const words = text.split(' '); const lines = []; let line = ''
  words.forEach((w) => { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w } else line = t })
  if (line) lines.push(line); return lines
}
const grain = (ctx) => {
  const c = document.createElement('canvas'); c.width = c.height = 160
  const g = c.getContext('2d'); const d = g.createImageData(160, 160)
  for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 14 }
  g.putImageData(d, 0, 0)
  ctx.fillStyle = ctx.createPattern(c, 'repeat'); ctx.fillRect(0, 0, W, H)
}

export async function drawCard({ title, titleMuted, who, rows, passed = '—', footer }) {
  try { await Promise.all(['500 40px Onest', '600 40px Onest', '400 40px Onest', '500 60px Caveat', '400 24px "IBM Plex Mono"'].map((f) => document.fonts.load(f, 'АБВ'))) } catch (e) {}
  const c = document.createElement('canvas'); c.width = W; c.height = H
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#FAFAFB'; ctx.fillRect(0, 0, W, H)

  // тень под стеклом
  blob(ctx, 760, 820, 560, [[0, 'rgba(76,91,255,.95)'], [0.45, 'rgba(138,134,255,.55)'], [1, 'rgba(138,134,255,0)']])
  blob(ctx, 420, 1200, 480, [[0, 'rgba(255,168,119,.85)'], [0.5, 'rgba(255,208,168,.45)'], [1, 'rgba(255,208,168,0)']])
  blob(ctx, 300, 640, 360, [[0, 'rgba(181,140,255,.55)'], [1, 'rgba(181,140,255,0)']])

  // логотип
  ctx.fillStyle = INK; ctx.font = '600 34px Onest'; ctx.textBaseline = 'alphabetic'
  const lx = spaced(ctx, 'АНАМНЕЗ', 80, 130, 6)
  ctx.fillStyle = OR; rr(ctx, lx + 14, 116, 56, 9, 4); ctx.fill()

  // заголовок
  ctx.font = '500 84px Onest'; let y = 290
  const lines = wrap(ctx, title, W - 160)
  ctx.fillStyle = INK; lines.forEach((l) => { ctx.fillText(l, 80, y); y += 88 })
  if (titleMuted) { ctx.fillStyle = MUTED; wrap(ctx, titleMuted, W - 160).forEach((l) => { ctx.fillText(l, 80, y); y += 88 }) }

  // стеклянная медкарта
  const cardY = Math.max(y + 40, 640), cardX = 80, cardW = W - 160
  const rowH = 104, cardH = 150 + rows.length * rowH + 190
  ctx.save(); ctx.shadowColor = 'rgba(40,44,90,.14)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 24
  ctx.fillStyle = 'rgba(255,255,255,.62)'; rr(ctx, cardX, cardY, cardW, cardH, 44); ctx.fill(); ctx.restore()
  ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = 2; rr(ctx, cardX, cardY, cardW, cardH, 44); ctx.stroke()

  ctx.font = '400 24px "IBM Plex Mono"'; ctx.fillStyle = BODY
  spaced(ctx, 'АНАМНЕЗ', cardX + 48, cardY + 72, 3)
  const whoU = who.toUpperCase(); let ww = 0; for (const ch of whoU) ww += ctx.measureText(ch).width + 3
  spaced(ctx, whoU, cardX + cardW - 48 - ww, cardY + 72, 3)
  ctx.fillStyle = 'rgba(20,22,27,.3)'; ctx.fillRect(cardX + 48, cardY + 100, cardW - 96, 2)

  const SHORT = { 'Тест на скрытую кровь': 'Скрытая кровь', 'Профилактический осмотр': 'Профосмотр', 'Внутриглазное давление': 'Глазное давление' }
  rows.forEach(([name0, freq], i) => {
    const name = SHORT[name0] || name0
    const ry = cardY + 100 + (i + 1) * rowH
    ctx.fillStyle = INK; ctx.font = '400 38px Onest'
    const nm = wrap(ctx, name, cardW - 96 - 300)[0]; ctx.fillText(nm, cardX + 48, ry - 32)
    ctx.fillStyle = BLUE; ctx.font = '500 58px Caveat'; ctx.textAlign = 'right'; ctx.fillText(freq, cardX + cardW - 48, ry - 28); ctx.textAlign = 'left'
    ctx.fillStyle = 'rgba(20,22,27,.08)'; ctx.fillRect(cardX + 48, ry, cardW - 96, 2)
  })

  // строка «Пройдено»
  const py = cardY + 100 + rows.length * rowH + 40
  ctx.fillStyle = 'rgba(255,255,255,.9)'; rr(ctx, cardX + 36, py, cardW - 72, 120, 28); ctx.fill()
  ctx.fillStyle = INK; ctx.font = '500 48px Onest'; ctx.fillText('Пройдено', cardX + 76, py + 76)
  ctx.fillStyle = passed === '—' ? OR : BLUE; ctx.font = '500 72px Caveat'; ctx.fillText(passed, cardX + 330, py + 80)
  ctx.strokeStyle = 'rgba(59,79,224,.5)'; ctx.setLineDash([8, 8]); ctx.lineWidth = 2
  ctx.beginPath(); ctx.arc(cardX + cardW - 120, py + 60, 46, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([])

  // подвал
  ctx.fillStyle = INK; ctx.font = '500 40px Onest'; ctx.fillText(footer || 'Собери свою карту', 80, H - 150)
  ctx.fillStyle = BODY; ctx.font = '400 28px "IBM Plex Mono"'; ctx.fillText(location.host + location.pathname.replace(/index\.html$/, ''), 80, H - 96)

  grain(ctx)
  return c
}

let blobFile = null
export async function openSheet(opts, shareText) {
  const sheet = document.getElementById('sheet')
  const img = document.getElementById('sheetImg')
  const save = document.getElementById('sheetSave')
  const send = document.getElementById('sheetShare')
  const c = await drawCard(opts)
  const url = c.toDataURL('image/png')
  img.src = url; save.href = url
  blobFile = await new Promise((r) => c.toBlob((b) => r(new File([b], 'anamnez.png', { type: 'image/png' })), 'image/png'))
  const canFiles = navigator.canShare && navigator.canShare({ files: [blobFile] })
  send.hidden = !canFiles
  send.onclick = async () => {
    try { await navigator.share({ files: [blobFile], text: shareText }); goal('share_sent') } catch (e) {}
  }
  sheet.hidden = false
  document.body.style.overflow = 'hidden'
}

export function initSheet() {
  const sheet = document.getElementById('sheet')
  if (!sheet) return
  const close = () => { sheet.hidden = true; document.body.style.overflow = '' }
  sheet.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', close))
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close() })
}
