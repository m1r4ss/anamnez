// Лёгкий параллакс первого экрана: пятна и карточки сдвигаются за курсором и при скролле
export function initParallax() {
  const root = document.querySelector('[data-parallax]')
  if (!root || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const layers = [...root.querySelectorAll('[data-depth]')]
  let mx = 0, my = 0, tx = 0, ty = 0, sy = 0
  const fine = matchMedia('(pointer: fine)').matches

  if (fine) {
    window.addEventListener('mousemove', (e) => {
      mx = (e.clientX / innerWidth - 0.5) * 2
      my = (e.clientY / innerHeight - 0.5) * 2
    }, { passive: true })
  }
  window.addEventListener('scroll', () => { sy = Math.min(window.scrollY, 900) }, { passive: true })

  const tick = () => {
    tx += (mx - tx) * 0.06
    ty += (my - ty) * 0.06
    layers.forEach((el) => {
      const d = parseFloat(el.dataset.depth)
      const x = tx * d * 22
      const y = ty * d * 18 + sy * d * -0.12
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
    })
    requestAnimationFrame(tick)
  }
  tick()
}
