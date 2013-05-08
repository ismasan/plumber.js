/*!
 * Plumber.Devices.ChokePoint
 * Copyright (C) 2013 Ismael Celis
 *
 * Wraps multiple pipes, runs their #add() methods in parallel and waits for all of them before finalizing the #add lifecycle.
 *
 * Usage:
 *
 *     var p1 = new Plumber.Pipe()
 *     var p2 = new SomeAjaxPipe()
 *     var results = new Plumber.Pipe()
 *     var choke = new Plumber.Devices.ChokePoint(p1, p2)
 *
 *     choke.add(struct) // won't pipe to `results` until both p1 and p2 have finished adding., which may be asynchronous.
 *
 * @constructor
 */
Plumber.Devices.ChokePoint = (function ($) {
  "use strict";
  
  function promisesFor(pipes, verb, struct) {
    return $.map(pipes, function (pipe) {
      return pipe[verb](struct)
    })
  }
  
  var ChokePoint = Plumber.Pipe.extend({
    initialize: function () {
      this.__wrapped = Plumber.Utils.toArray(arguments)
    },
    
    _add: function (struct, promise) {
      $.when.apply($, promisesFor(this.__wrapped, 'add', struct)).then(function () {
        promise.resolve(struct)
      })
    },
    
    _remove: function (struct, promise) {
      $.when.apply($, promisesFor(this.__wrapped, 'remove', struct)).then(function () {
        promise.resolve(struct)
      })
    }
  })
  
  return ChokePoint
  
})(jQuery)
