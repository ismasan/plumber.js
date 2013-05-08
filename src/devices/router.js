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
    
    pipe: function (other) {
      throw new Error("Instances of Plumber.Devices.Router cannot pipe")
    },
    
    _forwardAdd: function (struct) {
      var self = this
      resolveFirst(this.__routes.slice(0), 'add', struct, function () {
        if(self.__default) self.__default.add(struct)
      })
    },
    
    _forwardRemove: function (struct) {
      var self = this
      resolveFirst(this.__routes.slice(0), 'remove', struct, function () {
        if(self.__default) self.__default.remove(struct)
      })
    }
    
  })
  
  return Router
  
})(jQuery)