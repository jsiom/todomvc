const TextInput = require('text-input')
const Checkbox = require('checkbox')
const {Map} = require('immutable')
const {JSX} = require('mana')
const tape = require('tape')

const App = cursor =>
  <body>
    <div className='wrapper'>
      <section id='todoapp'>
        <Header cursor={cursor}/>
        <MainSection todos={cursor.get('todos')}
                     route={cursor.value.get('route')}/>
        <StatsSection todos={cursor.get('todos')}
                      route={cursor.value.get('route')}/>
      </section>
      <footer id='info'>
        <p>Double-click to edit a todo</p>,
        <p>Written by <a href='http://github.com/jkroso'>Jake Rosoman</a></p>
        <p>Part of <a href='http://todomvc.com'>TodoMVC</a></p>
      </footer>
    </div>
  </body>

const Header = ({cursor}) =>
  <header id='header'>
    <h1>Todos</h1>
    <TextInput cursor={cursor.get('field')}
               placeholder='What needs to be done?'
               isfocused={cursor.value.get('todos').every(notEditing)}
               onSubmit={title => {
                 title.trim().length && cursor.merge({
                   field: '',
                   todos: cursor.value.get('todos').push(Map({
                     title: title.trim(),
                     completed: false,
                     editing: false
                   }))
                 })
               }}/>
  </header>

const MainSection = ({todos, route}) =>
  <section id='main' class={{hidden: todos.value.size == 0}}>
    <input id='toggle-all'
           type='checkbox'
           checked={todos.value.every(get('completed'))}
           onClick={function() {
             todos.map(set('completed', !this.params.checked))
           }}/>
    <ul id='todo-list'>{
      todos.value.toArray().map((todo, index) => {
        if (route == 'completed' && !todo.get('completed')) return null
        if (route == 'active' && todo.get('completed')) return null
        return TodoItem(todos.get(index))
      }).filter(Boolean)
    }</ul>
  </section>

const TodoItem = todoᶜ => {
  if (todoᶜ.value.get('editing')) {
    return <TextInput
      cursor={todoᶜ.get('title')}
      isfocused={true}
      onCancel={() => {
        tape.backWhile(function(state){
          return todoᶜ.call(state).get('editing')
        })
      }}
      onBlur={function(event){
        if (todoᶜ.isCurrent) this.emit('submit', event.target.value)
      }}
      onSubmit={title => {
        if (!title.trim()) todoᶜ.destroy()
        else todoᶜ.set('editing', false)
      }}/>
  }
  const title = todoᶜ.value.get('title')
  return <li class={{completed: todoᶜ.value.get('completed')}}>
    <Checkbox className='toggle' cursor={todoᶜ.get('completed')}/>
    <label onDblclick={() => todoᶜ.set('editing', true)}>{title}</label>
    <button className='destroy' onClick={() => todoᶜ.destroy()}/>
  </li>
}

const StatsSection = ({todos, route}) => {
  var todosLeft = todos.value.filter(notCompleted).size
  return <footer id='footer' class={{hidden: todos.value.size == 0}}>
    <span id='todo-count'>
      <b>{todosLeft}</b>{todosLeft == 1 ? ' item' : ' items'} left
    </span>
    <ul id='filters'>
      <Link uri='#' selected={route == 'all'}>All</Link>
      <Link uri='#active' selected={route == 'active'}>Active</Link>
      <Link uri='#completed' selected={route == 'completed'}>Completed</Link>
    </ul>
    <button id='clear-completed'
            class={{hidden: todos.value.size == todosLeft}}
            onClick={() => todos.filter(notCompleted)}>
      Clear completed ({todos.value.size - todosLeft})
    </button>
  </footer>
}

const Link = ({uri, selected}, children) =>
  <li><a class={{selected}} href={uri}>{children}</a></li>

const notCompleted = todo => !todo.get('completed')
const notEditing = todo => !todo.get('editing')
const get = key => object => object.get(key)
const set = (key, value) => object => object.set(key, value)

export default App
