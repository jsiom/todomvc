var Map = require('immutable').Map
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
      isfocused: state.get('todos').toVector().every(function(todo){
        return !todo.get('editing')
      }),
      name: 'newTodo',
      onKeydown: function addTodo(event){
        if (event.which != 13/*enter*/) return
        var title = event.target.value.trim()
        if (title == '') return
        state.update('todos', function(todos){
         return todos.toVector().push(Map({
           completed: false,
           editing: false,
           title: title,
           id: cuid()
         }))
        }).set('field', '')
      },
      onKeyup: function saveField(event){
        state.set('field', event.target.value)
      }
    }]]
}

function mainSection(todos, route) {
  var visibleTodos = todos.filter(function(todo){
    return route === 'completed' && todo.get('completed')
      || route === 'active' && !todo.get('completed')
      || route === 'all'
  })

  return ['section#main', {hidden: !todos.toVector().length},
    ['input#toggle-all', {
      type: 'checkbox',
      name: 'toggle',
      checked: todos.toVector().every(function(todo){ return todo.get('completed') }),
      onChange: function toggleAll(event) {
        todos.update(function(todos){
          return todos.map(function(todo){
            return todo.set('completed', event.target.checked)
          }).toVector()
        })
      }
    }],
    ['label', {htmlFor: 'toggle-all'}, 'Mark all as complete'],
    ['ul#todo-list',
      visibleTodos.map(function(todo, index){
        return todoItem(todo, index, todos)
      }).toJS()]]
}

function todoItem(todo, index, todos) {
  function finishEdit(event){
    var title = event.target.value.trim()
    if (!todo.get('editing')) return
    if (title == '') return destroy(todos, index)
    todo.withMutations(function(todo){
      todo.set('editing', false)
      todo.set('title', title)
    })
  }
  return ['li',
    {className: (todo.get('completed') ? 'completed ': '')
              + (todo.get('editing') ? 'editing' : '')},
    ['.view',
      ['input.toggle', {
        type: 'checkbox',
        checked: todo.get('completed'),
        onChange: function toggle() {
          todo.set('completed', !todo.get('completed'))
        }
      }],
      ['label', {
        onDblclick: function edit(event) {
          todo.set('editing', true)
        }
      }, todo.get('title')],
      ['button.destroy', {onClick: destroy.bind(null, todos, index)}]],
    ['input.edit', {
      value: todo.get('title'),
      name: 'title',
      isfocused: todo.get('editing'),
      onKeydown: function cancel(event){
        if (event.which == 27/*esc*/) todo.set('editing', false)
        if (event.which == 13/*enter*/) finishEdit(event)
      },
      onKeyup: function save(event){
        todo.set('title', event.target.value)
      },
      onBlur: finishEdit
    }]]
}

function destroy(todos, index){
  todos.update(function(todos){
    return todos.splice(index, 1).toVector()
  })
}

function statsSection(todos, route) {
  var todosLeft = todos.filter(function(todo){
    return !todo.get('completed')
  }).toVector().length

  return ['footer#footer', {hidden: !todos.toVector().length},
    ['span#todo-count',
      ['strong', String(todosLeft), todosLeft === 1 ? ' item' : ' items', ' left']],
    ['ul#filters',
      link('#', 'All', route === 'all'),
      link('#active', 'Active', route === 'active'),
      link('#completed', 'Completed', route === 'completed')],
    ['button#clear-completed', {
      hidden: todos.toVector().length === todosLeft,
      onClick: function clearCompleted(){
        todos.update(function(todos){
          return todos.filter(function(todo){
            return !todo.get('completed')
          }).toVector()
        })
      }
    }, 'Clear completed (', String(todos.toVector().length - todosLeft), ')']]
}

function link(uri, text, selected) {
  return ['li', ['a' + (selected ? '.selected' : ''), {href: uri}, text]]
}

function footer(){
  return ['footer#info',
    ['p', 'Double-click to edit a todo'],
    ['p', 'Written by ', ['a', {href: 'http://github.com/jkroso'}, 'Jake Rosoman']],
    ['p', 'Part of ', ['a', { href: 'http://todomvc.com' }, 'TodoMVC']]]
}
