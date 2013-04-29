/*
var index = new Bootic.Index()

var Ajax = Bootic.Repository.extend({
  _add: function (item, promise) {
    $.post('/foo', item.attributes).then(promise)
  }
})

var repo = new Ajax(index)

users = new Bootic.Pipe()

index.pipe(users).pipe(view)

*/
Bootic.Repository = (function ($) {
  "use strict";
  
  var Repository = Bootic.Pipe.extend({
    
    initialize: function (index, options) {
      this.index = index
      this.options = options || {}
      this.pipe(this.index)
    }
    
  })
  
  return Repository
  
})(jQuery);