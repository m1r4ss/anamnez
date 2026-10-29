// Цели Яндекс Метрики. ID счётчика задаётся в src/partials/analytics.html
export function goal(name, params) {
  try {
    if (window.ym && window.YM_ID) window.ym(window.YM_ID, 'reachGoal', name, params)
  } catch (e) {}
}

const once = new Set()
export function goalOnce(name, params) {
  if (once.has(name)) return
  once.add(name)
  goal(name, params)
}

export function initGoals() {
  // клики по элементам с data-goal
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-goal]')
    if (el) goal(el.dataset.goal)
  })

  // дочитал историю / дошёл до разделов
  const marks = [
    ['#story', 'story_view'],
    ['#shadow', 'shadow_view'],
    ['#card', 'card_view'],
    ['.final', 'page_end']
  ]
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          goalOnce(en.target.dataset.goalView)
          io.unobserve(en.target)
        }
      })
    },
    { threshold: 0.4 }
  )
  marks.forEach(([sel, name]) => {
    const el = document.querySelector(sel)
    if (el) {
      el.dataset.goalView = name
      io.observe(el)
    }
  })
}
