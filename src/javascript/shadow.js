// Тень под матовым стеклом: чем дальше листаешь, тем больше тень.
// На последнем шаге («чекап») стекло проясняется и появляется контур.
const TAGS = ['жалоб нет', 'пройдёт', 'видно']

export function initShadow() {
  const sec = document.querySelector('.shadow')
  const stage = document.querySelector('.shadow__stage')
  if (!sec || !stage) return
  const states = sec.querySelectorAll('.shadow__states li')
  const tag = stage.querySelector('.shadow__tag')
  let ticking = false
  let last = -1

  const update = () => {
    ticking = false
    const r = sec.getBoundingClientRect()
    const total = sec.offsetHeight - window.innerHeight
    const p = Math.min(1, Math.max(0, -r.top / total))
    const clear = Math.min(1, Math.max(0, (p - 0.68) / 0.22))
    stage.style.setProperty('--p', p.toFixed(3))
    stage.style.setProperty('--clear', clear.toFixed(3))
    const idx = p < 0.34 ? 0 : p < 0.68 ? 1 : 2
    if (idx !== last) {
      last = idx
      states.forEach((li, i) => li.classList.toggle('is-on', i === idx))
      if (tag) {
        tag.textContent = TAGS[idx]
        tag.style.color = idx === 2 ? '#14161B' : '#3B4FE0'
      }
    }
  }
  const onScroll = () => {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(update)
    }
  }
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
}
