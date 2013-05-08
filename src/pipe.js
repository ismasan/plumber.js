/*

r.pipe(users).pipe(view)

*/

Plumber.Pipe = (function ($) {
  "use strict";
  
  function noop (item, promise) {
    promise.resolve(item)
  }
  
  var Pipe = Plumber.BasicObject.extend({
    
    preInitialize: function () {
      var options = arguments[arguments.length - 1];
      this.__pipes = []
      
      if(typeof options == 'object' && 'logger' in options) {
        this.logger = options.logger
      } else {
        this.logger = new Plumber.Logger()
      }
    },
    
    toString: function () {
      return 'Plumber.Pipe'
    },
    
    /**
     * Add a struct to this pipe
     *
     * The struct enters the add() lifecycle, which may or may not result in the struct being added to othe pipes registered with #pipe()
     *
     * This method is composed of the following hooks:
     * 
     * add(struct)
     *   filter(struct, filterPromise)
     *     _add(struct, addPromise)
     *       _formwardAdd(struct)
     *
     * add() returns a promise, so multiple add() operations can be chained:
     *
     *     $.when(pipe1.add(struct), pipe2.add(struct), pipe3.add(struct)).then(...)
     *
     * @param {Struct} struct The instance of Struct to add.
     * @memberOf Pipe
     * @returns {jQuery.Deferred()}
     */
    add: function (struct) {
      var filterPromise = $.Deferred(),
          addPromise = $.Deferred(),
          self = this;
      
      this.logger.info('adding ' + struct)
      this.trigger('adding', struct)
      
      addPromise.done(function (struct, evtName) {
        if(!struct) throw new Error("Make sure your _add method resolves the promise with an item as argument")
        self.logger.info('added ' + struct)
        self.trigger(evtName || 'add', struct)
        self._forwardAdd(struct)
      })
      
      filterPromise.done(function (struct) {
        self.logger.info('filter ' + struct)
        self._add(struct, addPromise)
      }).fail(function (struct) {
        self.trigger('reject', struct)
      })
      
      this.filter(struct, filterPromise)
      
      return addPromise
    },
    
    /**
     * Remove a struct from this pipe
     *
     * The struct enters the remove() lifecycle, which may or may not result in the struct being removed from othe pipes registered with #pipe()
     *
     * This method is composed of the following hooks:
     * 
     * remove(struct)
     *   _remove(struct, removePromise)
     *     _formwardRemove(struct)
     *
     * remove() returns a promise, so multiple remove() operations can be chained:
     *
     *     $.when(pipe1.remove(struct), pipe2.remove(struct), pipe3.remove(struct)).then(...)
     *
     * @param {Struct} struct The instance of Struct to remove.
     * @memberOf Pipe
     * @returns {jQuery.Deferred()}
     */
    remove: function (struct) {
      var removePromise = $.Deferred(),
          self = this;
      
      this.logger.info('removing ' + struct)
      this.trigger('removing', struct)
      
      removePromise.done(function (struct, evtName) {
        if(!struct) throw new Error("Make sure your _remove method resolves the promise with an item as argument")
        
        self.logger.info('removed ' + struct)
        self.trigger(evtName || 'remove', struct)
        self._forwardRemove(struct)
      })
      
      this._remove(struct, removePromise)
      
      return removePromise
    },
    
    /**
     * Pipe to other pipes
     *
     * Forward add() and remove() calls to other pipes.
     *
     * Example:
     *
     *     pipe1.pipe(pipe2).pipe(pipe3)
     *     pipe1.add(new Struct()) // pipe2.add() will be called with struct
     *
     * @param {Plumber.Pipe} other an instance of Pipe or its subclasses
     * @memberOf Pipe
     * @returns {Plumber.Pipe}
     */
    pipe: function (other) {
      if($.inArray(other, this.__pipes) > -1) {
        this.logger.error("Attempt to pipe " + this + " -> " + other + " twice. Ignoring.")
        return other
      }
      
      this.__pipes.push(other)
      this.logger.info('piped ' + this + ' to ' + other)
      
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
  })
  
  $.extend(Pipe.prototype, Plumber.Events)
  
  return Pipe
  
})(jQuery);