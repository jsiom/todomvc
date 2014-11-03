var Todo = require('immutable').Map
var cuid = require('cuid')

module.exports = app

function app(state) {
  return ['.todomvc-wrapper',
    ['section#todoapp',
      [header, state],
      [mainSection, state.get('todos'), state.get('route')],
      [statsSection, state.get('todos'), state.get('route')]],
    [footer]]
}

function header(state) {
  return ['header#header',
    ['h1', 'Todos'],
    ['input#new-todo', {
      placeholder: 'What needs to be done?',
      value: state.get('field'),
      type: 'text',
      isfocused: state.get('todos').every(function(todo){ return !todo.get('editing') }),
      onKeydown: function addTodo(event){
        if (event.which != 13/*enter*/) return
        var title = event.target.value.trim()
        if (title == '') return
        var value = state.value.set('field', '')
        var todos = value.get('todos').push(Todo({
          completed: false,
          editing: false,
          title: title,
          id: cuid()
        }))
        state.update(value.set('todos', todos))
      },
      onKeypress: function(event){
        if (event.which == 13/*enter*/) return
        var char = String.fromCharCode(event.charCode)
        return state.set('field', event.target.value + char)
      }
    }]]
}

function mainSection(todos, route) {
  return ['section#main', {hidden: todos.value.size == 0},
    ['input#toggle-all', {
      type: 'checkbox',
      checked: todos.every(function(todo){ return todo.get('completed') }),
      onClick: function toggleAll(event) {
        todos.map(function(todo){
          return todo.value.set('completed', event.target.checked)
        }).commit()
      }
    }],
    ['ul#todo-list',
      todos.map(function(todo, index){
        if (route == 'completed' && !todo.get('completed')) return null
        if (route == 'active' && todo.get('completed')) return null
        return todoItem(todo, index, todos)
      }).value.toArray().filter(Boolean)]]
}

function todoItem(todo, index, todos) {
  if (todo.get('editing')) {
    var finishEdit = function(event){
      var title = event.target.value.trim()
      if (title == '') todos.remove(index).commit()
      else todo.merge({editing: false, title: title})
    }
    return ['input.edit', {
      value: todo.get('title'),
      isfocused: true,
      onKeydown: function cancel(event){
        if (event.which == 27/*esc*/) todo.set('editing', false)
        if (event.which == 13/*enter*/) finishEdit(event)
      },
      onKeypress: function save(event){
        if (event.which == 13/*enter*/) return
        var char = String.fromCharCode(event.charCode)
        todo.set('title', event.target.value + char)
      },
      onBlur: finishEdit
    }]
  }
  return ['li', {class: {completed: todo.get('completed')}},
    ['input.toggle', {
      type: 'checkbox',
      checked: todo.get('completed'),
      onClick: function toggle(event) {
        todo.set('completed', !todo.get('completed'))
        event.preventDefault()
      }
    }],
    ['label', {onDblclick:function(){todo.set('editing', true)}}, todo.get('title')],
    ['button.destroy', {onClick:function(){ todos.remove(index).commit() }}]]
}

function statsSection(todos, route) {
  var todosLeft = todos.value.filter(notCompleted).size
  return ['footer#footer', {hidden: todos.value.size == 0},
    ['span#todo-count',
      ['strong', String(todosLeft), todosLeft == 1 ? ' item' : ' items', ' left']],
    ['ul#filters',
      link('#', 'All', route == 'all'),
      link('#active', 'Active', route == 'active'),
      link('#completed', 'Completed', route == 'completed')],
    ['button#clear-completed', {
      hidden: todos.value.size == todosLeft,
      onClick: function clearCompleted(){
        todos.filter(notCompleted).commit()
      }
    }, 'Clear completed (', String(todos.value.size - todosLeft), ')']]
}

function notCompleted(todo){
  return !todo.get('completed')
}

function link(uri, text, selected) {
  return ['li', ['a', {class: {selected: selected}, href: uri}, text]]
}

function footer(){
  return ['footer#info',
    ['p', 'Double-click to edit a todo'],
    ['p', 'Written by ', ['a', {href: 'http://github.com/jkroso'}, 'Jake Rosoman']],
    ['p', 'Part of ', ['a', { href: 'http://todomvc.com' }, 'TodoMVC']]]
}