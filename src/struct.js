Bootic.Struct = (function ($) {
  "use strict";
  
  function uuid () { // improve this
    return 'uid' + new Date().getTime() + Math.random(1000);
  }
  
  var Struct = Bootic.BasicObject.extend({
    
    _id_field: 'id',
    
    toString: function () {
      return "Bootic.Struct " + this.id()
    },
    
    initialize: function (attrs) {
      this.attributes = attrs || {}
      this.uid = this.get(this._id_field) || uuid();
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
    
    id: function () {
      return this.uid
    }
  })
  
  $.extend(Struct.prototype, Bootic.Events)
  
  return Struct
})(jQuery);