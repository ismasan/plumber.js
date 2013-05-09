/*!
 * Plumber.Devices.Ventilator
 * Copyright (C) 2013 Ismael Celis
 *
 * Two-way ventilator that can be use for fan-in and fan-out behaviour.
 * It will pipe any messages added to pipes in the IN array to all pipes in the OUT array.
 * Messages added to pipes in the IN array will also be piped normally through Ventilator#pipe()
 *
 * Examples:
 * ++ Fan-in
 *
 *    var in1 = new Plumber.Pipe()  
 *    var in2 = new Plumber.Pipe()
 *    var results = new Plumber.Pipe()
 *    var ventilator = new Plumber.Devices.Ventilator([in1, in2])
 *    ventilator.pipe(results)
 *
 *    in1.add(struct) // forwards struct to out1 and out2
 *
 * ++ Fan-out
 *
 *    var ventilator = new Plumber.Devices.Ventilator(null, [out1, out2])
 *    ventilator.add(struct) // forwards struct to out1 and out2
 *
 * ++ Many-to-many
 *
 *     var ventilator = new Plumber.Devices.Ventilator([in1, in2], [out1, out2])
 *
 *     in1.add(struct) // forwards struct to out1 and out2
 *     in2.add(struct) // forwards struct to out1 and out2
 *
 * @constructor
 */
Plumber.Devices.Ventilator = (function ($) {
  "use strict";
  
  function push(arr, struct, verb) {
    for(var i = 0; i < arr.length; i++) {
      arr[i][verb](struct)
    }
  }
  
  var Ventilator = Plumber.Pipe.extend({
    
    initialize: function (inPipes, outPipes) {
      this.__in = !!inPipes ? ($.isArray(inPipes) ? inPipes : [inPipes]) : []
      this.__out = !!outPipes ? ($.isArray(outPipes) ? outPipes : [outPipes]) : []
      this.__pipeIn()
    },
    
    _add: function (struct, promise) {
      push(this.__out, struct, 'add')
      promise.resolve(struct)
    },
    
    _remove: function (struct, promise) {
      push(this.__out, struct, 'remove')
      promise.resolve(struct)
    },
    
    __pipeIn: function () {
      for(var i = 0; i < this.__in.length; i++) {
        this.__in[i].pipe(this)
      }
    }
  })
  
  return Ventilator
})(jQuery)