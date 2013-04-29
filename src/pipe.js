/*
r = new Ajax('/foo')

users = new Users()

r.on('add', function (item) {
  users.add(item)
})

r.pipe(users).pipe(view)

*/

Bootic.Pipe = (function ($) {
  "use strict";
  
  function noop (item) {
    return true
  }
  
  var Pipe = Bootic.BasicObject.extend({
    
    add: function (item) {
      if(this.addFilter(item)) {
        this._add(item)
        this.trigger('add', item) 
      }
      return this
    },
    
    remove: function (item) {
      if(this.removeFilter(item)) {
        this._remove(item)
        this.trigger('remove', item)
      }
      return this
    },
    
    pipe: function (other) {
      this._pipe(other)
      this.on('add', function (item) {
        other.add(item)
      }).on('remove', function (item) {
        other.remove(item)
      })
      return other
    },
    
    addFilter: noop,
    removeFilter: noop,
    _add: noop,
    _remove: noop,
    _pipe: noop
  })
  
  $.extend(Pipe.prototype, Bootic.Events)
  
  return Pipe
  
})(jQuery);