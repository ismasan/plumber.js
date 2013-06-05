/*!
 * Plumber.Devices.Router
 * Copyright (C) 2013 Ismael Celis
 *
 * Declare routing functions and pipe instances to route to.
 *
 * Usage:
 *
 *     var p1 = new Plumber.Pipe()
 *     var p2 = new lumber.Pipe()
 *     var default = new Plumber.Pipe()
 *     var router = new Plumber.Devices.Router()
 *
 *     router
 *      .route(p1, function (struct, promise) {
 *          if(struct.get('name') == 'Joe') promise.resolve()
 *          else promise.reject()
 *       })
 *       .route(p2, function (struct, promise) {
 *          if(struct.get('name') == 'Jane') promise.resolve()
 *          else promise.reject()
 *       })
 *       .default(default)
 *
 *     router.add(new Plumber.Struct({name: 'Joe'})) // forwards struct to p1
 *     router.add(new Plumber.Struct({name: 'Jane'})) // forwards struct to p2
 *     router.add(new Plumber.Struct({name: 'Paul'})) // forwards struct to default
 *
 * @constructor
 */
Plumber.Devices.Router = (function ($) {
  "use strict";
  
  function resolveFirst (arr, verb, struct, fallback) {
    var first = arr.shift(),
        pipe  = first.pipe,
        fn    = first.fn,
        pr    = $.Deferred();
    
    pr.done(function () {
      pipe[verb](struct)
    }).fail(function () {
      if(arr.length == 0) {
        fallback()
      } else {
        resolveFirst(arr, verb, struct, fallback)
      }
    })
    
    fn(struct, pr)
  }
  
  var Router = Plumber.Pipe.extend({
    
    initialize: function () {
      this.__routes = []
    },
    
    route: function (pipe, fn) {
      this.__routes.push({pipe: pipe, fn: fn})
      return this
    },
    
    default: function (pipe) {
      this.__default = pipe
      return this
    },
    
    _forwardAdd: function (struct) {
      var self = this
      resolveFirst(this.__routes.slice(0), 'add', struct, function () {
        if(self.__default) self.__default.add(struct)
      })
      // Pipe like normal
      Plumber.Pipe.prototype._forwardAdd.call(this, struct)
    },
    
    _forwardRemove: function (struct) {
      var self = this
      resolveFirst(this.__routes.slice(0), 'remove', struct, function () {
        if(self.__default) self.__default.remove(struct)
      })
      // Pipe like normal
      Plumber.Pipe.prototype._forwardRemove.call(this, struct)
    }
    
  })
  
  return Router
  
})(jQuery)