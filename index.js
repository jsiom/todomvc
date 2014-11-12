var immutable = require('immutable').fromJS
var time = require('./history')
var App = require('app')

var data = localStorage.hasOwnProperty('todos-jsiom')
  ? JSON.parse(localStorage.getItem('todos-jsiom'))
  : {todos: [], field: ''}

data.route = location.hash.slice(1) || 'all'

var app = new App(immutable(data), require('./render'))

app.on('redraw', function saveState(){
  localStorage.setItem('todos-jsiom', JSON.stringify(this.state))
})

window.addEventListener('hashchange', function setRoute(){
  app.state.get('route').update(location.hash.slice(1) || 'all')
}, true)

time.constructor(app.atom)

window.addEventListener('keydown', function(e){
  if (e.ctrlKey || e.altKey || e.shiftKey || !e.metaKey) return
  if (e.which == 89/*y*/) time.forward()
  if (e.which == 90/*z*/) time.back()
  if (e.which == 90 || e.which == 89) e.preventDefault()
}, true)
