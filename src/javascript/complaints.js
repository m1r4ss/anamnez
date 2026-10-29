import { cardState, emit } from './card.js'
import { goalOnce } from './goals.js'

export function initComplaints() {
  const chips = document.querySelectorAll('#chips .chipbtn')
  const hand = document.getElementById('ccHand')
  const title = document.getElementById('ccTitle')
  const text = document.getElementById('ccText')
  const btn = document.getElementById('ccBtn')
  if (!chips.length) return

  const render = () => {
    const list = cardState.complaints
    if (!list.length) {
      hand.textContent = 'нет'
      title.textContent = 'Отметь, что беспокоит'
      text.textContent = 'Даже если кажется, что это ерунда.'
      btn.hidden = true
      return
    }
    hand.textContent = list.map((x) => x.split(' ')[0].toLowerCase()).join(', ')
    title.textContent = 'Это уже жалобы, а не ерунда'
    text.textContent = 'С ними — к терапевту по месту прикрепления. Приём бесплатный по ОМС, направление не нужно.'
    btn.hidden = false
  }

  chips.forEach((c) =>
    c.addEventListener('click', () => {
      c.classList.toggle('is-on')
      c.setAttribute('aria-pressed', c.classList.contains('is-on'))
      cardState.complaints = [...chips].filter((x) => x.classList.contains('is-on')).map((x) => x.textContent)
      render()
      emit()
      goalOnce('complaints')
    })
  )
  render()
}
