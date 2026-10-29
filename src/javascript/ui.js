export function initHeader() {
  const h = document.querySelector('.header')
  if (!h) return
  const on = () => h.classList.toggle('is-scrolled', window.scrollY > 20)
  on()
  window.addEventListener('scroll', on, { passive: true })
}

export function initReveal() {
  const els = document.querySelectorAll('[data-reveal]')
  if (!('IntersectionObserver' in window)) {
    els.forEach((e) => e.classList.add('is-in'))
    return
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-in')
          io.unobserve(en.target)
        }
      }),
    { threshold: 0.2 }
  )
  els.forEach((e) => io.observe(e))
}
