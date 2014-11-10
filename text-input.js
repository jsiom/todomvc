var create = require('create')

function TextInput(cursor, props){
  addProperties(this, props)
  this.properties.value = cursor.value
  this.cursor = cursor
}

TextInput.prototype = create(['input', {
  type: 'text',
  onKeydown: function handleSubmit(event){
    if (event.which ==  8/*delete*/) this.cursor.slice(0, -1)
    if (event.which == 13/*enter*/) this.emit('submit', event.target.value)
    if (event.which == 27/*esc*/) this.emit('cancel')
  },
  onKeypress: function updateCursor(event){
    if (event.which == 13/*enter*/) return
    var char = String.fromCharCode(event.charCode)
    return this.cursor.update(event.target.value + char)
  }
}])

TextInput.prototype.emit = function(type){
  var fn = this.events[type]
  if (fn) fn.apply(this, [].slice.call(arguments, 1))
}

function addProperties(node, properties){
  var props = node.properties = Object.create(node.properties)
  var events = node.events = Object.create(node.events)
  for (var key in properties) {
    var value = properties[key]
    if (typeof value == 'function' && /^on\w+$/.test(key)) {
      key = key.substring(2).toLowerCase()
      if (events[key]) {
        events[key] = (function(previous, next){
          return function(event){
            previous.call(this, event)
            next.call(this, event)
          }
        })(events[key], value)
      } else {
        events[key] = value
      }
    } else if (key == 'class') {
      for (key in value) if (value[key]) {
        props.className = props.className
          ? props.className + ' ' + key
          : key
      }
    } else {
      props[key] = value
    }
  }
}

module.exports = function(cursor, props){
  return new TextInput(cursor, props)
}
