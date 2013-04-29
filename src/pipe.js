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
  
  function noop (item, promise) {
    promise.resolve()
  }
  
  var Pipe = Bootic.BasicObject.extend({
    
    preInitialize: function () {
      var options = arguments[arguments.length - 1];
      if(typeof options == 'object' && 'logger' in options) {
        this.logger = options.logger
      } else {
        this.logger = new Bootic.Logger()
      }
    },
    
    toString: function () {
      return 'Bootic.Pipe'
    },
    
    add: function (item) {
      var filterPromise = $.Deferred(),
          self = this;
      
      this.logger.info('adding ' + item.id())
      this.trigger('adding', item)
      
      filterPromise.done(function () {
        var addPromise = $.Deferred()
        addPromise.done(function (evtName) {
          self.logger.info('added ' + item.id())
          self.trigger(evtName || 'add', item)
        })
        self.logger.info('filter', item)
        self._add(item, addPromise)
      })
      
      this.addFilter(item, filterPromise)
      
      return this
    },
    
    remove: function (item) {
      var removePromise = $.Deferred(),
          self = this;
      
      this.logger('removing ' + item.id())
      this.trigger('removing', item)
      
      removePromise.done(function (evtName) {
        self.logger.info('removed' + item.id())
        self.trigger(evtName || 'remove', item)
      })
      
      this._remove(item, removePromise)
      
      return this
    },
    
    pipe: function (other) {
      this.logger.info('piped ' + this + ' to ' + other)
      this._pipe(other)
      this.on('add', function (item) {
        other.add(item)
      }).on('remove', function (item) {
        other.remove(item)
      })
      return other
    },
    
    addFilter: noop,
    _add: noop,
    _remove: noop,
    _pipe: $.noop
  })
  
  $.extend(Pipe.prototype, Bootic.Events)
  
  return Pipe
  
})(jQuery);