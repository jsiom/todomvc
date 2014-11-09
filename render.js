var TextInput = require('./text-input')
var Checkbox = require('./checkbox')
var Todo = require('immutable').Map
var cuid = require('cuid')

module.exports = app

function app(state) {
  return ['.todomvc-wrapper',
    ['section#todoapp',
      [header, state],
      [mainSection, state.get('todos'), state.get('route').value],
      [statsSection, state.get('todos'), state.get('route').value]],
    [footer]]
}

function header(state) {
  return ['header#header',
    ['h1', 'Todos'],
    TextInput(state.get('field'), {
      placeholder: 'What needs to be done?',
      isfocused: state.value.get('todos').every(notEditing),
      onSubmit: function addTodo(title){
        title = title.trim()
        if (title == '') return
        var value = state.value.set('field', '')
        var todos = value.get('todos').push(Todo({
          completed: false,
          editing: false,
          title: title,
          id: cuid()
        }))
        state.update(value.set('todos', todos))
      }
    })]
}

function mainSection(todos, route) {
  return ['section#main', {hidden: todos.value.size == 0},
    ['input#toggle-all', {
      type: 'checkbox',
      checked: todos.every(function(todo){ return todo.get('completed') }),
      onClick: function toggleAll(event) {
        todos.map(function(todo){
          return todo.set('completed', event.target.checked)
        }).commit()
      }
    }],
    ['ul#todo-list',
      todos.value.map(function(todo, index){
        if (route == 'completed' && !todo.get('completed')) return null
        if (route == 'active' && todo.get('completed')) return null
        return todoItem(todos.get(index), index, todos)
      }).toArray().filter(Boolean)]]
}

function todoItem(todo, index, todos) {
  if (todo.get('editing').value) {
    return TextInput(todo.get('title'), {
      isfocused: true,
      onCancel: function cancel(){
        todo.set('editing', false).commit()
      },
      onSubmit: function save(title){
        var title = title.trim()
        if (title == '') todos.remove(index).commit()
        else todo.merge({editing: false, title: title}).commit()
      }
    })
  }
  return ['li', {class: {completed: todo.get('completed').value}},
    [Checkbox, todo.get('completed')],
    ['label', {
      onDblclick: function(){ todo.set('editing', true).commit() }
    }, todo.get('title').value],
    ['button.destroy', {
      onClick:function(){ todos.remove(index).commit() }
    }]]
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
      onClick: function clearCompleted(){
        todos.filter(notCompleted).commit()
      }
    }, 'Clear completed (', String(todos.value.size - todosLeft), ')']]
}

function notCompleted(todo){
  return !todo.get('completed')
}

function notEditing(todo){
  return !todo.get('editing')
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
