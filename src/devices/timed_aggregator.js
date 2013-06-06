/*!
 * Plumber.Devices.TimedAggregator
 * Copyright (C) 2013 Ismael Celis
 *
 * Timed aggregator (or "reducer") that buffers structs as per user-provided delay and runs an aggregate function.
 * After delay has passed it forwards aggregated struct to pipes downstream.
 * Useful for building time-interval charts and widgets, aggregated logs, etc.
 *
 * Examples:
 *
 *    var Counter = Plumber.Devices.TimedAggregator.extend({
 *      startValues: {
 *        count: 0
 *      },
 *     
 *      aggregate: function (mem, struct) {
 *        mem.set('count', mem.get('count') + 1)
 *      }
 *    })
 *
 *    var aggregator = new Counter(200)  
 *    var results = new Plumber.Pipe()
 *    aggregator.pipe(results)
 *
 *    aggregator.add(struct) // aggregates into "mem" struct.
 *    aggregator.add(struct)
 *    
 *    // ... After 200 milliseconds, a "mem" struct is piped to results with a `count` value of 2
 *
 * @constructor
 */
Plumber.Devices.TimedAggregator = (function ($) {
  "use strict";
  
  var TimedAggregator = Plumber.Pipe.extend({
    // Override this in sub classes. 
    // These are the properties used to initialize and reset the "mem" struct.
    startValues: {},
    
    /**
     * Initialize with a delay
     *
     * @param {int} delay Delay (in milliseconds) to forward mem struct onto piped pipes.
     * @memberOf Plumber.Devices.TimedAggregator
     */
    initialize: function (delay) {
      this.__mem = new Plumber.Struct(this.startValues)
      this.__run(delay)
    },
    
    /**
     * Override `add` to run aggregate function and NOT forward immediatly.
     *
     * @param {Struct} struct Struct object being added directly or from pipes upstream.
     * @memberOf Plumber.Devices.TimedAggregator
     * @returns jQuery.Deferred()
     */
    add: function (struct) {
      var p = $.Deferred()
      this.aggregate(this.__mem, struct)
      p.resolve(struct)
      return p
    },
    
    /**
     * Custom aggregate (reduce) function.
     *
     * Override this in sub classes to perform custom aggregate or reduce operations.
     *
     * @param {Struct} mem Initial struct with aggregated data. Initialised with `startValues` properties.
     * @param {Struct} newStruct Struct instance being added directly or from pipes upstream.
     * @memberOf Plumber.Devices.TimedAggregator
     */
    aggregate: function (mem, newStruct) {
      // ej. mem.set('count', mem.get('count') + newStruct.get('count'))
    },
    
    __run: function (delay) {
      var self = this
      setTimeout(function () {
        // Forward mem struct
        Plumber.Pipe.prototype.add.call(self, self.__mem)
        // Reset mem and start again
        self.__mem = new Plumber.Struct(self.startValues)
        self.__run(delay)
      }, delay)
    }
  })
  
  return TimedAggregator
  
})(jQuery);