import { planFor, dayOff } from './plan.js'
import { goalOnce, goal } from './goals.js'

export const cardState = { age: null, sex: 'f', complaints: [] }
const listeners = []
export const onCardChange = (fn) => listeners.push(fn)
export const emit = () => listeners.forEach((fn) => fn(cardState))

const today = () => {
  const d = new Date()
  return String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + d.getFullYear()
}

export function initCard() {
  const age = document.getElementById('age')
  const card = document.getElementById('medcard')
  if (!age || !card) return
  const rowsEl = document.getElementById('mcRows')
  const who = document.getElementById('mcWho')
  const ageEl = document.getElementById('mcAge')
  const dayoffEl = document.getElementById('mcDayoff')
  const actions = document.getElementById('mcActions')
  const passed = document.getElementById('mcPassed')
  const finalPassed = document.getElementById('finalPassed')
  const segBtns = document.querySelectorAll('[data-sex]')

  const render = () => {
    const a = parseInt(cardState.age, 10)
    const ok = a >= 18 && a <= 99
    who.textContent = ok ? (cardState.sex === 'f' ? 'женщина' : 'мужчина') : '—'
    ageEl.textContent = ok ? a : '—'
    rowsEl.innerHTML = ''
    if (!ok) {
      const li = document.createElement('li')
      li.className = 'medcard__empty'
      li.textContent = a && a < 18 ? 'Диспансеризация положена с 18 лет.' : 'Заполни возраст и пол — здесь появится твой список.'
      rowsEl.appendChild(li)
      dayoffEl.hidden = true
      actions.hidden = true
      card.classList.remove('is-clear')
      return
    }
    planFor(a, cardState.sex).forEach(([name, freq], i) => {
      const li = document.createElement('li')
      li.style.animationDelay = i * 60 + 'ms'
      li.innerHTML = `<span>${name}</span><span class="hand">${freq}</span><input type="checkbox" aria-label="Отметка: ${name}" />`
      rowsEl.appendChild(li)
    })
    dayoffEl.hidden = false
    dayoffEl.querySelector('span').textContent = dayOff(a)
    actions.hidden = false
    card.classList.add('is-clear') // стекло проясняется
    goalOnce('card_done', { age: a, sex: cardState.sex })
  }

  age.addEventListener('input', () => {
    cardState.age = age.value
    render()
    emit()
  })
  segBtns.forEach((b) =>
    b.addEventListener('click', () => {
      cardState.sex = b.dataset.sex
      segBtns.forEach((x) => {
        x.classList.toggle('is-on', x === b)
        x.setAttribute('aria-checked', x === b)
      })
      render()
      emit()
    })
  )

  document.getElementById('markDone').addEventListener('click', () => {
    const d = today()
    passed.textContent = '✓ ' + d
    passed.classList.add('is-done')
    card.classList.add('is-done')
    if (finalPassed) finalPassed.textContent = '✓ ' + d
  })

  onCardChange((s) => {
    const c = document.getElementById('mcComplaints')
    c.textContent = s.complaints.length ? s.complaints.map((x) => x.toLowerCase()).join(', ') : 'нет'
  })
  render()
}

export { goal }
