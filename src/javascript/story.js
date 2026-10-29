// История героя: заголовки можно «потыкать» — меняются цитата и тень под стеклом
const STEPS = [
  { tag: 'спорт, режим', q: 'Бегал, следил за сном и питанием. <span>Чувствовал себя отлично — повода идти к врачу не было.</span>', cap: 'Влад, 24 года · до чекапа' },
  { tag: 'жалоб нет', q: '«У меня не было никаких жалоб. <span>Я не чувствовал себя плохо.»</span>', cap: 'Влад, 24 года · запись в анамнезе: «жалоб нет»' },
  { tag: 'чекап', q: 'Пошёл на чекап просто так, <span>без повода и без симптомов.</span>', cap: 'Влад, 24 года · обычная проверка' },
  { tag: 'диагноз', q: '«Я обнаружил его абсолютно случайно, на&nbsp;чекапе. <span>У&nbsp;меня не&nbsp;было никаких жалоб, я&nbsp;активно занимался спортом.»</span>', cap: 'Влад, 24 года · рак щитовидной железы, 2-я стадия' },
  { tag: 'лечение', q: 'Лето ушло на лечение. <span>Раньше, чем болезнь успела о себе заявить.</span>', cap: 'Влад, 24 года · лечение' },
  { tag: 'здоров', q: 'Сейчас Влад здоров. <span>Потому что нашли рано — когда ещё ничего не болело.</span>', cap: 'Влад, 24 года · сейчас здоров' }
]

export function initStory() {
  const btns = [...document.querySelectorAll('.story__steps [data-step]')]
  const vis = document.querySelector('[data-step-visual]')
  if (!btns.length || !vis) return
  const quote = document.getElementById('storyQuote')
  const cap = document.getElementById('storyCap')
  const tag = document.getElementById('storyTag')
  let cur = 3
  let auto = null

  const set = (i) => {
    cur = i
    btns.forEach((b, k) => {
      b.classList.toggle('is-on', k === i)
      b.setAttribute('aria-selected', k === i)
      b.style.setProperty('--d', Math.abs(k - i))
    })
    vis.dataset.stepVisual = i
    vis.classList.remove('is-swap'); void vis.offsetWidth; vis.classList.add('is-swap')
    quote.innerHTML = STEPS[i].q
    cap.textContent = STEPS[i].cap
    tag.textContent = STEPS[i].tag
  }
  const stopAuto = () => { if (auto) { clearInterval(auto); auto = null } }

  btns.forEach((b, i) => {
    b.addEventListener('click', () => { stopAuto(); set(i) })
    b.addEventListener('mouseenter', () => { if (matchMedia('(pointer: fine)').matches) { stopAuto(); set(i) } })
  })

  // пока пользователь не трогал — история сама идёт по шагам, когда видна
  const io = new IntersectionObserver((en) => {
    en.forEach((e) => {
      if (e.isIntersecting && auto === null && !vis.dataset.touched) {
        set(0)
        auto = setInterval(() => set((cur + 1) % STEPS.length), 2600)
      } else if (!e.isIntersecting) stopAuto()
    })
  }, { threshold: 0.5 })
  io.observe(vis)
  btns.forEach((b) => b.addEventListener('pointerdown', () => (vis.dataset.touched = '1')))
  set(3)
}
