import './index.scss'
import { initHeader, initReveal } from './javascript/ui.js'
import { initShadow } from './javascript/shadow.js'
import { initCard } from './javascript/card.js'
import { initComplaints } from './javascript/complaints.js'
import { initParents } from './javascript/parents.js'
import { initGoals } from './javascript/goals.js'
import { initParallax } from './javascript/parallax.js'
import { initStory } from './javascript/story.js'
import { initReasons } from './javascript/reasons.js'
import { initSheet } from './javascript/share.js'

document.addEventListener('DOMContentLoaded', () => {
  initGoals()
  initHeader()
  initReveal()
  initShadow()
  initCard()
  initComplaints()
  initParents()
  initParallax()
  initStory()
  initReasons()
  initSheet()
})
