// Возражения: открыто только одно
export function initReasons() {
  const items = [...document.querySelectorAll('.reason')]
  items.forEach((d) =>
    d.addEventListener('toggle', () => {
      if (d.open) items.forEach((o) => { if (o !== d) o.open = false })
    })
  )
}
