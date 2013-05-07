/*

r.pipe(users).pipe(view)

*/

Bootic.Pipe = (function ($) {
  "use strict";
  
  function noop (item, promise) {
    promise.resolve(item)
  }
  
  var Pipe = Bootic.BasicObject.extend({
    
    preInitialize: function () {
      var options = arguments[arguments.length - 1];
      this.__pipes = []
      
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
      
      this.logger.info('adding ' + item)
      this.trigger('adding', item)
      
      filterPromise.done(function (item) {
        if(!item) throw new Error("Make sure your _add method resolves the promise with an item as argument")
        
        var addPromise = $.Deferred()
        addPromise.done(function (item, evtName) {
          if(!item) throw new Error("Make sure your _add method resolves the promise with an item as argument")
          self.logger.info('added ' + item)
          self.trigger(evtName || 'add', item)
          self._forwardAdd(item)
        })
        self.logger.info('filter ' + item)
        self._add(item, addPromise)
      }).fail(function (item) {
        self.trigger('reject', item)
      })
      
      this.filter(item, filterPromise)
      
      return filterPromise
    },
    
    remove: function (item) {
      var removePromise = $.Deferred(),
          self = this;
      
      this.logger.info('removing ' + item)
      this.trigger('removing', item)
      
      removePromise.done(function (item, evtName) {
        if(!item) throw new Error("Make sure your _remove method resolves the promise with an item as argument")
        
        self.logger.info('removed ' + item)
        self.trigger(evtName || 'remove', item)
        self._forwardRemove(item)
      })
      
      this._remove(item, removePromise)
      
      return removePromise
    },
    
    pipe: function (other) {
      this.__pipes.push(other)
      this.logger.info('piped ' + this + ' to ' + other)
      this._pipe(other)
      return other
    },
    
    _forwardAdd: function (struct) {
      for(var i = 0; i < this.__pipes.length; i++) {
        this.__pipes[i].add(struct)
      }
    },
    
    _forwardRemove: function (struct) {
      for(var i = 0; i < this.__pipes.length; i++) {
        this.__pipes[i].remove(struct)
      }
    },
    
    filter: noop,
    _add: noop,
    _remove: noop,
    _pipe: $.noop
  })
  
  $.extend(Pipe.prototype, Bootic.Events)
  
  return Pipe
  
})(jQuery);