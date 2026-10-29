import './index.scss'
import { initHeader, initReveal } from './javascript/ui.js'
import { initShadow } from './javascript/shadow.js'
import { initCard } from './javascript/card.js'
import { initComplaints } from './javascript/complaints.js'
import { initParents } from './javascript/parents.js'
import { initGoals } from './javascript/goals.js'

document.addEventListener('DOMContentLoaded', () => {
  initGoals()
  initHeader()
  initReveal()
  initShadow()
  initCard()
  initComplaints()
  initParents()
})
