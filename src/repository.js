/*
var index = new Plumber.Index()

var Ajax = Plumber.Repository.extend({
  _add: function (item, promise) {
    $.post('/foo', item.attributes).then(promise)
  }
})

var repo = new Ajax(index)

users = new Plumber.Pipe()

index.pipe(users).pipe(view)

*/
Plumber.Repository = (function ($) {
  "use strict";
  
  var Repository = Plumber.Pipe.extend({
    
    initialize: function (index, options) {
      this.index = index
      this.options = options || {}
      this.pipe(this.index)
    }
    
  })
  
  return Repository
  
})(jQuery);