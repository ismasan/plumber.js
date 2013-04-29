Bootic.Repository = (function ($) {
  "use strict";
  
  var Repository = Bootic.Pipe.extend({
    
    initialize: function (index) {
      this.index = index
    },
    
    add: function (item) {
      this.trigger('adding', item)
      
    },
    
    remove: function (item) {
      
    },
    
    _add: function (item) {
      
    },
    
    _remove: function (item) {
      
    }
    
  })
  
  return Repository
  
})(jQuery);