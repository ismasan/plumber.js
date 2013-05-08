/*!
 * Bootic - Events
 * Copyright (C) 2013 Ismael Celis
 * MIT Licensed
 *
 * @module
 *
 * Usage:
 *     var MyObject = {...}
 *     $.extend(MyObject, Events)
 *     MyObject.bind('foo', function (i) { alert(i)})
 *     MyObject.trigger('foo', 1)
 *
 */
Bootic.Events = (function ($) {
  "use strict";
  
  return {
    on: function (eventName, fn) {
      this.__handlers = this.__handlers || {}
      this.__handlers[eventName] = this.__handlers[eventName] || []
      this.__handlers[eventName].push(fn)
      return this
    },
    
    off: function (eventName, fn) {
      if(!this.__handlers || !this.__handlers[eventName]) return this
      this.__handlers[eventName] = $.grep(this.__handlers, function (clbk) {
        return clbk != fn
      })
      
      return this
    },
    
    trigger: function (eventName) {
      if(this.__handlers == undefined) return this
      
      var handlers = this.__handlers[eventName]
      if(!handlers) return this
      var args = Bootic.Utils.toArray(arguments, 1);
      
      handlers.forEach(function (handler) {
        handler.apply(null, args)
      })
      
      return this
    }
  }
  
})(jQuery);