Bootic.Index = (function ($) {
  "use strict";
  
  var Index = Bootic.Pipe.extend({
    
    struct: Bootic.Struct,
    
    initialize: function (structType) {
      if(structType) this.struct = structType
      
      this._index = {}
      this._list = []
    },
    
    add: function (item) {
      // Wrap data in structs
      if(!item.hasOwnProperty('constructor') || item.constructor != this.struct) {
        item = new this.struct(item)
      }
      
      var found;
      if(found = this._index[item.id()]) { // found. Update
        found.set(item.attributes)
        this.trigger('update', item)
      } else { // new. Create and trigger
        this._index[item.id()] = item
        this._list.push(item)
        this.trigger('add', item)
      }
      
      return item
    },
    
    remove: function (item) {
      var found;
      if(found = this._index[item.id()]) {
        item.trigger('remove')
        delete this._index[item.id()]
        this._list = this._list.splice(this._list.indexOf(item), 1)
        this.trigger('remove')
      }
      return item
    },
    
    /* Re-play existing list onto newly piped objects
    -----------------------------------------------*/
    _pipe: function (other) {
      var self = this;
      $.each(this._list, function (i, item) {
        other.add(item)
      })
    }
  })
  
  return Index
  
})(jQuery)