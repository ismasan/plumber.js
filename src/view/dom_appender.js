Plumber.DomAppender = (function ($, window) {
  
  /* Standardize requestAnimationFrame, or shim it if not available
  ------------------------------------------*/
  var requestAnimationFrame = window.requestAnimationFrame || 
                              window.mozRequestAnimationFrame || 
                              window.webkitRequestAnimationFrame || 
                              window.msRequestAnimationFrame || function (fn) {
                                return window.setTimeout(fn)
                              }
  
  
  var afid = null
  var queue = []
  function globalAnimationFrame (fn) {
    queue.push(fn)
    
    if(afid) {
      return false
    } else {
      requestAnimationFrame(function () {
        for(var i = 0; i < queue.length; i++) {
          queue[i]()
        }
        queue = []
        afid = null
      })
    }
  }
  
  var DomAppender = Plumber.BasicObject.extend({
    initialize: function ($container) {
      this.container = $container
      this._appendBuffer = []
      this._removeBuffer = []
      this._addAnimationFrameId = null
      this._removeAnimationFrameId = null
    },
    
    append: function ($e, appendMethod) {
      appendMethod = appendMethod || 'append'
      
      this._appendBuffer.push($e)
      var removeIdx = this._removeBuffer.indexOf($e)
      if(removeIdx > -1) {
        this._removeBuffer.splice(removeIdx, 1)        
      }
      
      var self = this
      
      globalAnimationFrame(function () {
        self.container[appendMethod](self._appendBuffer)
        self._appendBuffer = []
      })
      
      return this
    },
    
    remove: function ($e, removeMethod) {
      removeMethod = removeMethod || 'remove'
      
      this._removeBuffer.push($e)
      // scheduled for removal. Remove from append schedule
      var appendIdx = this._appendBuffer.indexOf($e)
      if(appendIdx > -1) {
        this._appendBuffer.splice(appendIdx, 1)        
      }
      
      var self = this
      
      globalAnimationFrame(function () {
        for(var i = 0; i < self._removeBuffer.length; i++) {
          self._removeBuffer[i][removeMethod]()
        }
        
        self._removeBuffer = []
      })
    }
  })
  
  return DomAppender
})(jQuery, window)