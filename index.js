const immutable = require('immutable').fromJS
const App = require('mana/app')
const tape = require('tape')

const data = localStorage.hasOwnProperty('todos-jsiom')
  ? JSON.parse(localStorage.getItem('todos-jsiom'))
  : {todos: [], field: ''}

data.route = location.hash.slice(1) || 'all'

const app = new App(immutable(data), require('./render'))

app.onRedraw = () => {
  localStorage.setItem('todos-jsiom', JSON.stringify(app.state))
}

window.addEventListener('hashchange', () => {
  app.state.get('route').update(location.hash.slice(1) || 'all')
}, true)

tape.constructor(app.atom)

window.addEventListener('keydown', e => {
  if (e.ctrlKey || e.altKey || e.shiftKey || !e.metaKey) return
  if (e.which == 89/*y*/) tape.forward()
  if (e.which == 90/*z*/) tape.back()
  if (e.which == 90 || e.which == 89) e.preventDefault()
}, true)
