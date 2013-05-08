Plumber.Devices.Pipeline = (function ($) {
  "use strict";
  
  var Pipeline = Plumber.Pipe.extend({
    initialize: function () {
      this.__wrapped = Plumber.Utils.toArray(arguments)
    },
    
    _add: function (struct, promise) {
      this.__chain('add', this.__wrapped.slice(0), struct, promise)
    },
    
    _remove: function (struct, promise) {
      this.__chain('remove', this.__wrapped.slice(0), struct, promise)
    },
    
    __chain: function (verb, arr, struct, finalPromise) {
      var fn,
          self = this,
          first = arr.shift();
    
      if(arr.length == 0) { // last one.
        fn = function (struct) {
          finalPromise.resolve(struct, verb)
        }
      } else { // keep chaining recursively
        fn = function (struct) {
          self.__chain(verb, arr, struct, finalPromise)
        }
      }
    
      first[verb](struct).then(fn) // add, remove
    }
  })
  
  return Pipeline
  
})(jQuery)
