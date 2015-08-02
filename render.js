var TextInput = require('text-input')
var Checkbox = require('checkbox')
var Todo = require('immutable').Map
var tape = require('tape')

module.exports = function app(state) {
  return ['.wrapper',
    ['section#todoapp',
      [header, state],
      [mainSection, state.get('todos'), state.value.get('route')],
      [statsSection, state.get('todos'), state.value.get('route')]],
    ['footer#info',
      ['p', 'Double-click to edit a todo'],
      ['p', 'Written by ', ['a', {href: 'http://github.com/jkroso'}, 'Jake Rosoman']],
      ['p', 'Part of ', ['a', { href: 'http://todomvc.com' }, 'TodoMVC']]]]
}

function header(state) {
  return ['header#header',
    ['h1', 'Todos'],
    TextInput(state.get('field'), {
      placeholder: 'What needs to be done?',
      isfocused: state.value.get('todos').every(notEditing),
      onSubmit: function addTodo(title){
        title.trim().length && state.merge({
          field: '',
          todos: state.value.get('todos').push(Todo({
            title: title.trim(),
            completed: false,
            editing: false
          }))
        })
      }
    })]
}

function mainSection(todos, route) {
  return ['section#main', {class:{hidden: todos.value.size == 0}},
    ['input#toggle-all', {
      type: 'checkbox',
      checked: todos.value.every(get('completed')),
      onClick: function toggleAll() {
        todos.map(set('completed', !this.properties.checked))
      }
    }],
    ['ul#todo-list', todos.value.toArray().map(function(todo, index){
      if (route == 'completed' && !todo.get('completed')) return null
      if (route == 'active' && todo.get('completed')) return null
      return todoItem(todos.get(index))
    })]]
}

function todoItem(todo) {
  if (todo.value.get('editing')) {
    return TextInput(todo.get('title'), {
      isfocused: true,
      onCancel: function undo(){
        tape.backWhile(function(state){
          return todo.call(state).get('editing')
        })
      },
      onBlur: function save(event){ this.emit('submit', event.target.value) },
      onSubmit: function save(title){
        if (!title.trim()) todo.destroy()
        else todo.set('editing', false)
      }
    })
  }
  return ['li', {class: {completed: todo.value.get('completed')}},
    [Checkbox, todo.get('completed')],
    ['label', {onDblclick: function(){ todo.set('editing', true) }}, todo.value.get('title')],
    ['button.destroy', {onClick: function(){ todo.destroy() }}]]
}

function statsSection(todos, route) {
  var todosLeft = todos.value.filter(notCompleted).size
  return ['footer#footer', {class:{hidden: todos.value.size == 0}},
    ['span#todo-count',
      ['b', String(todosLeft)], todosLeft == 1 ? ' item' : ' items', ' left'],
    ['ul#filters',
      link('#', 'All', route == 'all'),
      link('#active', 'Active', route == 'active'),
      link('#completed', 'Completed', route == 'completed')],
    ['button#clear-completed', {
      class: {hidden: todos.value.size == todosLeft},
      onClick: function clearCompleted(){ todos.filter(notCompleted) }
    }, 'Clear completed (', String(todos.value.size - todosLeft), ')']]
}

function link(uri, text, selected) {
  return ['li', ['a', {class: {selected: selected}, href: uri}, text]]
}

function notCompleted(todo){ return !todo.get('completed') }
function notEditing(todo){ return !todo.get('editing') }
function get(key){ return function(o){ return o.get(key) }}
function set(key, value){ return function(o){ return o.set(key, value) }}
