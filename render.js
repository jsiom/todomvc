var TextInput = require('./text-input')
var Checkbox = require('./checkbox')
var Todo = require('immutable').Map
var cuid = require('cuid')

module.exports = function app(state) {
  return ['.todomvc-wrapper',
    ['section#todoapp',
      [header, state],
      [mainSection, state.get('todos'), state.value.get('route')],
      [statsSection, state.get('todos'), state.value.get('route')]],
    [footer]]
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
            completed: false,
            editing: false,
            title: title.trim(),
            id: cuid()
          }))
        })
      }
    })]
}

function mainSection(todos, route) {
  return ['section#main', {hidden: todos.value.size == 0},
    ['input#toggle-all', {
      type: 'checkbox',
      checked: todos.value.every(function(todo){ return todo.get('completed') }),
      onClick: function toggleAll(event) {
        todos.map(function(todo){
          return todo.set('completed', event.target.checked)
        })
      }
    }],
    ['ul#todo-list', todos.value.toArray().map(function(todo, index){
      if (route == 'completed' && !todo.get('completed')) return null
      if (route == 'active' && todo.get('completed')) return null
      return todoItem(todos.get(index), index, todos)
    })]]
}

function todoItem(todo, index, todos) {
  if (todo.value.get('editing')) {
    return TextInput(todo.get('title'), {
      isfocused: true,
      onCancel: function cancel(){
        todo.set('editing', false)
      },
      onSubmit: function save(title){
        var title = title.trim()
        if (title == '') todos.remove(index)
        else todo.merge({editing: false, title: title})
      }
    })
  }
  return ['li', {class: {completed: todo.value.get('completed')}},
    [Checkbox, todo.get('completed')],
    ['label', {onDblclick: function(){ todo.set('editing', true) }}, todo.value.get('title')],
    ['button.destroy', {onClick: function(){ todos.remove(index) }}]]
}

function statsSection(todos, route) {
  var todosLeft = todos.value.filter(notCompleted).size
  return ['footer#footer', {hidden: todos.value.size == 0},
    ['span#todo-count',
      ['b', String(todosLeft)], todosLeft == 1 ? ' item' : ' items', ' left'],
    ['ul#filters',
      link('#', 'All', route == 'all'),
      link('#active', 'Active', route == 'active'),
      link('#completed', 'Completed', route == 'completed')],
    ['button#clear-completed', {
      hidden: todos.value.size == todosLeft,
      onClick: function clearCompleted(){ todos.filter(notCompleted) }
    }, 'Clear completed (', String(todos.value.size - todosLeft), ')']]
}

function notCompleted(todo){ return !todo.get('completed') }
function notEditing(todo){ return !todo.get('editing') }

function link(uri, text, selected) {
  return ['li', ['a', {class: {selected: selected}, href: uri}, text]]
}

function footer(){
  return ['footer#info',
    ['p', 'Double-click to edit a todo'],
    ['p', 'Written by ', ['a', {href: 'http://github.com/jkroso'}, 'Jake Rosoman']],
    ['p', 'Part of ', ['a', { href: 'http://todomvc.com' }, 'TodoMVC']]]
}
