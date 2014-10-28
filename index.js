var immutable = require('immutable')
var App = require('app')

var data = localStorage.hasOwnProperty('todos-jsiom')
  ? JSON.parse(localStorage.getItem('todos-jsiom'))
  : {route: 'all', todos: [], field: ''}

data = immutable.fromJS(data)

var state = data.cursor(function onChange(data){
  app.state = data.cursor(onChange)
  app.requestRedraw()
})

var app = new App(state, require('./render'))

app.on('redraw', function saveState(){
  localStorage.setItem('todos-jsiom', JSON.stringify(this.state))
})

window.addEventListener('hashchange', function setRoute(){
  app.state.set('route', location.hash.slice(1) || 'all')
})
