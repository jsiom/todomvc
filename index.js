var immutable = require('immutable').fromJS
var App = require('app')

var data = localStorage.hasOwnProperty('todos-jsiom')
  ? JSON.parse(localStorage.getItem('todos-jsiom'))
  : {route: 'all', todos: [], field: ''}

var app = new App(immutable(data), require('./render'))

app.on('redraw', function saveState(){
  localStorage.setItem('todos-jsiom', JSON.stringify(this.state))
})

window.addEventListener('hashchange', function setRoute(){
  app.state.get('route').update(location.hash.slice(1) || 'all')
})
