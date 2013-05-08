/*!
 * Plumber.Pipe
 * Copyright (C) 2013 Ismael Celis
 *
 * Base Pipe interface.
 *
 * A pipe responds to #add(), #remove() and #pipe(), and can be chained to other pipes.
 *
 * Usage:
 *
 *     var p1 = new Plumber.Pipe()
 *     var p2 = new Plumber.Pipe()
 *     
 *     p1.pipe(p2)
 *
 *     p1.add(new Plumber.Struct({name: 'Joe'})) // p2 gets #add() called with struct instance.
 *
 * Pipe subclasses can define a #filter that checks or processes passed structs. 
 * A failed filter prevents the pipe from forwarding to other pipes.
 *
 *     var JoesFilter = Plumber.Pipe.extend({
 *       filter: function (struct, promise) {
 *          if(struct.get('name') == 'Joe') promise.resolve(struct)
 *          else promise.reject(struct)
 *       }
 *     })
 *
 *     var f = new JoesFilter()
 *     f.add(new Plumber.Struct({name: 'Joe'})) // forwards to other pipes
 *     f.add(new Plumber.Struct({name: 'Jane'})) // doesn't forward
 *
 * @constructor
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
     * This method is composed of the following hooks, that can be redefined in subclasses:
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
     * This method is composed of the following hooks, than can be redefined in subclasses:
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
    
    /**
     * Forwards a struct to piped pipes at the end of the #add() lifecycle.
     *
     * @param {Struct} struct The Struct instance being forwarded.
     */
    _forwardAdd: function (struct) {
      for(var i = 0; i < this.__pipes.length; i++) {
        this.__pipes[i].add(struct)
      }
    },
    
    /**
     * Forwards a struct to piped pipes at the end of the #remove() lifecycle.
     *
     * @param {Struct} struct The Struct instance being forwarded.
     */
    _forwardRemove: function (struct) {
      for(var i = 0; i < this.__pipes.length; i++) {
        this.__pipes[i].remove(struct)
      }
    },
    
    /**
     * Filters a struct 
     *
     * @param {Struct} struct The Struct instance being forwarded.
     * @param {jQuery.Deferred} promise A promise to resolve or fail the filter. A failed filter stops the #add lifecycle.
     */
    filter: noop,
    _add: noop,
    _remove: noop,
  })
  
  $.extend(Pipe.prototype, Plumber.Events)
  
  return Pipe
  
})(jQuery);