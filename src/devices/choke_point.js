Bootic.Devices.ChokePoint = (function ($) {
  "use strict";
  
  var ChokePoint = Bootic.Pipe.extend({
    initialize: function () {
      this.__wrapped = Bootic.Utils.toArray(arguments)
    },
    
    _add: function (struct, promise) {
      $.when.apply($, this.__promisesFor('add', struct)).then(function () {
        promise.resolve(struct)
      })
    },
    
    _remove: function (struct, promise) {
      $.when.apply($, this.__promisesFor('remove', struct)).then(function () {
        promise.resolve(struct)
      })
    },
    
    __promisesFor: function (verb, struct) {
      return $.map(this.__wrapped, function (pipe) {
        return pipe[verb](struct)
      })
    }
  })
  
  return ChokePoint
  
})(jQuery)
