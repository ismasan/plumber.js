Plumber.Struct = (function ($) {
  "use strict";
  
  function uuid () { // improve this
    return 'uid' + new Date().getTime() + Math.random(1000);
  }
  
  var Struct = Plumber.BasicObject.extend({
    
    toString: function () {
      return "Plumber.Struct " + this.uid()
    },
    
    _uid_field_name: null,
    
    initialize: function (attrs) {
      this.attributes = attrs || {}
      this.__uid = uuid();
    },
    
    get: function (key) {
      return this.attributes[key]
    },
    
    set: function (key, value) {
      if(typeof key == 'object') { // passed an object
        for(var k in key) {
          if(key.hasOwnProperty(k)) this.set(k, key[k])
        }
      } else if(this.attributes[key] !== value) { // passed a key and value
        this.attributes[key] = value
        this.trigger('change:' + key, value)
      }
      return this
    },
    
    has: function (key) {
      return key in this.attributes
    },
    
    uid: function () {
      return !!this._uid_field_name ? this.get(this._uid_field_name) : this.__uid
    }
  })
  
  $.extend(Struct.prototype, Plumber.Events)
  
  return Struct
})(jQuery);