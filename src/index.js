/*!
 * Plumber.Index
 * Copyright (C) 2013 Ismael Celis
 */
Plumber.Index = (function ($) {
  "use strict";
  
  var Index = Plumber.Pipe.extend({
    
    struct: Plumber.Struct,
    
    toString: function () {
      return 'Plumber.Index'
    },
    
    initialize: function (structType) {
      if(structType) this.struct = structType
      this._index = {}
      this._list = []
    },
    
    _add: function (item, promise) {
      // Wrap data in structs
      if((!'constructor' in item) || (item.constructor != this.struct)) {
        item = new this.struct(item)
      }
      
      var found;
      if(found = this._index[item.uid()]) { // found. Update
        found.set(item.attributes)
        promise.resolve(item, 'update')
      } else { // new. Create and trigger
        this._index[item.uid()] = item
        this._list.push(item)
        promise.resolve(item, 'add')
      }
      
    },
    
    _remove: function (item, promise) {
      var found;
      if(found = this._index[item.uid()]) {
        delete this._index[item.uid()]
        this._list.splice(this._list.indexOf(item), 1)
        promise.resolve(item)
      }

    },
    
    /* Re-play existing list onto newly piped objects
    -----------------------------------------------*/
    pipe: function (other) {
      var self = this;
      
      $.each(this._list, function (i, item) {
        other.add(item)
      })
      
      return Plumber.Pipe.prototype.pipe.call(this, other)
    }
  })
  
  return Index
  
})(jQuery)