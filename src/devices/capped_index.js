/*!
 * Plumber.Devices.CappedIndex
 * Copyright (C) 2013 Ismael Celis
 *
 * A "capped index" can hold a defined number of structs at a time. 
 * Older structs are `remove`d as new ones are added. 
 * This is useful for building rolling views, infinite scrolling, real time charts and others where you only want to keep a limited number of data points in memory or view.
 *
 * Examples:
 *    var index = new Plumber.Devices.CappedIndex(10) // holds up to 10 structs.
 *
 *    index.pipe(someViewPipe)
 *
 *    for(var i = 0; i < 100; i++) {
 *      index.add(new Struct({name: i})) // calls `remove` on piped pipes after struct number 10
 *    }
 *
 * @constructor
 */
Plumber.Devices.CappedIndex = (function ($) {
  "use strict";
  
  var CappedIndex = Plumber.Index.extend({
    
    /**
     * Initialize with struct limit and an optional struct type
     *
     * @param {Int} limit A number to limit index to. Default 30
     * @param {Struct} structType The Struct constructor to wrap raw data with. Defaults to Plumber.Struct
     */
    initialize: function (limit, structType) {
      this.limit = limit || 30
      Plumber.Index.prototype.initialize.call(this, structType)
    },

    _add: function (item, promise) {
      // remove first if limit reached
      if(this._list.length > this.limit - 1) this.remove(this._list[0])
      // add next
      return Plumber.Index.prototype._add.call(this, item, promise)
    }

  })
  
  return CappedIndex
})(jQuery)