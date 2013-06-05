/*!
 * Plumber.Devices.LeakyPipeline
 * Copyright (C) 2013 Ismael Celis
 *
 * Wraps multiple pipes, pipe them using each pipe's `pipe` method. Return self so you can add guard filters.
 * This pipeline is "leaky" because adding to intermediate pipes will forward data to pipes down the chain.
 *
 * Usage:
 *
 *     var p1 = new Plumber.Pipe()
 *     var p2 = new SomeAjaxPipe()
 *     var results = new Plumber.Pipe()
 *     var pipeline = new Plumber.Devices.LeakyPipeline(p1, p2)
 *
 *     pipeline.add(struct) // will forward struct to p1, p2 and finally pipe on to results pipe
 *
 *     p2.add(struct) // will also forward down to results pipe
 *
 * @constructor
 */
Plumber.Devices.LeakyPipeline = (function ($) {
  "use strict";
  
  var LeakyPipeline = Plumber.Pipe.extend({
    
    initialize: function () {
      var pipes = Plumber.Utils.toArray(arguments);
      
      this.__last = pipes[pipes.length - 1]
      
      var first = pipes[0]
      
      Plumber.Utils.chain(pipes)
      Plumber.Pipe.prototype.pipe.call(this, first)
    },
    
    /* Override `pipe` so it delegates to last pipe in chain */
    pipe: function (other) {
      this.__last.pipe(other)
    }
    
  })
  
  return LeakyPipeline
  
})(jQuery)
