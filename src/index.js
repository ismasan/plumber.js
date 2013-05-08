/*!
 * Plumber.Index
 * Copyright (C) 2013 Ismael Celis
 *
 * An index keeps track of structs added and removed to it.
 * They also pipe current state onto piped pipes.
 *
 * @constructor
 */
Plumber.Index = (function ($) {
  "use strict";
  
  var Index = Plumber.Pipe.extend({
    
    struct: Plumber.Struct,
    
    toString: function () {
      return 'Plumber.Index'
    },
    
    /**
     * Initialize with an optional struct type
     *
     * @param {Struct} structType The Struct constructor to wrap raw data with. Defaults to Plumber.Struct
     */
    initialize: function (structType) {
      if(structType) this.struct = structType
      this._index = {}
      this._list = []
    },
    
    /**
     * Adds struct to internal index and resolve add promise.
     *
     * When adding a struct that already exists in the index it will not be piped, but the struct attributes will me merges.
     * This triggers change events in the struct, which can be handled by views oor other pipes downstream.
     *
     * @param {Struct} struct The Struct instance to add. If it is a raw JS object it will be wrapped in a Struct before adding.
     * @param {jQuery.Deferred} promise An instance of jQuery.Deferred to resolve this index's `add` lifecycle.
     */
    _add: function (struct, promise) {
      // Wrap data in structs
      if((!'constructor' in struct) || (struct.constructor != this.struct)) {
        struct = new this.struct(struct)
      }
      
      var found;
      if(found = this._index[struct.uid()]) { // found. Update
        found.set(struct.attributes)
        promise.resolve(struct, 'update')
      } else { // new. Create and trigger
        this._index[struct.uid()] = struct
        this._list.push(struct)
        promise.resolve(struct, 'add')
      }
      
    },
    
    /**
     * Removes struct from internal index and resolve remove promise.
     *
     * @param {Struct} struct The Struct instance to add. If it is a raw JS object it will be wrapped in a Struct before adding.
     * @param {jQuery.Deferred} promise An instance of jQuery.Deferred to resolve this index's `remove` lifecycle.
     */
    _remove: function (struct, promise) {
      var found;
      if(found = this._index[struct.uid()]) {
        delete this._index[struct.uid()]
        this._list.splice(this._list.indexOf(struct), 1)
        promise.resolve(struct)
      }

    },
    
    /**
     * Register other pipes to be forwarded structs on successful `add`s,
     * Re-play existing indexed structs onto newly piped objects
     *
     * @param {Pipe} other An instance of Pipe or its subclasses to register for piping.
     */
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