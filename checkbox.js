var create = require('create')

function Checkbox(cursor){
  this.cursor = cursor
  this.properties = Object.create(this.properties)
  this.properties.checked = cursor.value
}

Checkbox.prototype = create(['input.toggle', {
  type: 'checkbox',
  onClick: function(event){
    this.cursor.update(!this.cursor.value)
    event.preventDefault()
  }
}])

module.exports = function(cursor){ return new Checkbox(cursor) }
