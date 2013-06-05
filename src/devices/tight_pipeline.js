/*!
 * Plumber.Devices.TightPipeline
 * Copyright (C) 2013 Ismael Celis
 *
 * Wraps multiple pipes, chain their #add and #remove calls sequentially while allowing for async execution. 
 * This pipeline is "tight" because it can only be initiated by calling `add` on the pipeline itself.
 *
 * Usage:
 *
 *     var p1 = new Plumber.Pipe()
 *     var p2 = new SomeAjaxPipe()
 *     var results = new Plumber.Pipe()
 *     var pipeline = new Plumber.Devices.TightPipeline(p1, p2)
 *
 *     pipeline.add(struct) // will forward struct to p1, p2 and finally pipe on to results pipe
 *
 * @constructor
 */
Plumber.Devices.TightPipeline = (function ($) {
  "use strict";
  
  function chain (verb, arr, struct, finalPromise) {
    var fn,
        first = arr.shift();
  
    if(arr.length == 0) { // last one.
      fn = function (struct) {
        finalPromise.resolve(struct, verb)
      }
    } else { // keep chaining recursively
      fn = function (struct) {
        chain(verb, arr, struct, finalPromise)
      }
    }
  
    first[verb](struct).then(fn) // add, remove
  }
  
  var TightPipeline = Plumber.Pipe.extend({
    initialize: function () {
      this.__wrapped = Plumber.Utils.toArray(arguments)
    },
    
    _add: function (struct, promise) {
      chain('add', this.__wrapped.slice(0), struct, promise)
    },
    
    _remove: function (struct, promise) {
      chain('remove', this.__wrapped.slice(0), struct, promise)
    }
    
  })
  
  return TightPipeline
  
})(jQuery)
