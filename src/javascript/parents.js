import { planFor } from './plan.js'
import { goal } from './goals.js'

export function initParents() {
  const age = document.getElementById('pAge')
  if (!age) return
  const rows = document.getElementById('pRows')
  const who = document.getElementById('pWho')
  const msg = document.getElementById('pMsg')
  const tg = document.getElementById('tgShare')
  const copy = document.getElementById('copyShare')
  const segs = document.querySelectorAll('[data-psex]')
  let sex = 'f'

  const textFor = (a, list) => {
    const name = sex === 'f' ? 'Мам' : 'Пап'
    const lines = list.map(([n, f]) => `— ${n}: ${f}`).join('\n')
    return `${name}, посмотрел(а), что тебе положено бесплатно по ОМС в ${a} лет:\n${lines}\nДавай вместе запишемся?`
  }

  const render = () => {
    const a = parseInt(age.value, 10) || 58
    const list = planFor(a, sex).filter(([n]) => n !== 'Профилактический осмотр')
    who.textContent = (sex === 'f' ? 'женщина, ' : 'мужчина, ') + a
    msg.textContent = (sex === 'f' ? 'Мам' : 'Пап') + ', посмотрел(а), что тебе положено бесплатно в этом году. Давай вместе запишемся?'
    rows.innerHTML = list.slice(0, 4).map(([n, f]) => `<li><span>${n}</span><span class="hand">${f}</span></li>`).join('')
    const url = location.href.split('#')[0]
    tg.href = 'https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(textFor(a, list))
    copy.dataset.text = textFor(a, list) + '\n' + url
  }

  age.addEventListener('input', render)
  segs.forEach((b) =>
    b.addEventListener('click', () => {
      sex = b.dataset.psex
      segs.forEach((x) => {
        x.classList.toggle('is-on', x === b)
        x.setAttribute('aria-checked', x === b)
      })
      render()
    })
  )
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copy.dataset.text)
      copy.textContent = 'Скопировано'
      setTimeout(() => (copy.textContent = 'Скопировать'), 1800)
    } catch (e) {}
  })
  render()
}
