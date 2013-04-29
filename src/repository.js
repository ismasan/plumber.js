Bootic.Repository = (function ($) {
  "use strict";
  
  function ajax(item, fn) {
    setTimeout(fn, 5000)
  }
  
  var Repository = Bootic.Pipe.extend({
    
    initialize: function (index) {
      this.index = index
      this.pipe(this.index)
    },
    
    _add: function (item, promise) {
      ajax(item, function () {
        promise.resolve()
      })
    }
    
  })
  
  return Repository
  
})(jQuery);