Bootic.Controller = (function ($, window) {
  
  var ItemController = Bootic.BasicObject.extend({
    initialize: function (item, $e) {
      this.$e = $e
      this.bindings = rivets.bind(this.$e, {item: item})
    },
    
    destroy: function () {
      this.bindings.unbind()
      return this
    }
  })
  
  var Controller = Bootic.Pipe.extend({
    
    appendMethod: 'append',
    itemController: ItemController,
    
    initialize: function (source, $e) {
      this.source = source;
      this.$e = $e;
      this.$container = this.$e.find('[data-items]');
      this.$itemElement = this.$container.children().remove()
      this._children = {}
      this._appendBuffer = []
      this._removeBuffer = []
      this._addAnimationFrameId = null
      this._removeAnimationFrameId = null
      source.pipe(this)
    },
    
    _add: function (item, promise) {
      // create and index child view
      var child = new this.itemController(item, this.$itemElement.clone())
      this._children[item.id()] = child
      this.enqueueForAppend(child)
      
      promise.resolve()
    },
    
    _remove: function (item) {
      // unbind, destroy and de-index child-view
      var child = this._children[item.id()].destroy()
      delete this._children[item.id()]
      
      this.enqueueForRemove(child)
    },
    
    enqueueForAppend: function (child) {
      this._appendBuffer.push(child.$e)
      var removeIdx = this._removeBuffer.indexOf(child.$e)
      if(removeIdx > -1) {
        this._removeBuffer.splice(removeIdx, 1)        
      }
      
      var self = this
      
      if(this._addAnimationFrameId) {
        return
      }
      
      this._addAnimationFrameId = window.requestAnimationFrame(function () {
        self.$container[self.appendMethod](self._appendBuffer)
        self._appendBuffer = []
        self._addAnimationFrameId = null
      })
      
    },
    
    enqueueForRemove: function (child) {
      this._removeBuffer.push(child.$e)
      // scheduled for removal. Remove from append schedule
      var appendIdx = this._appendBuffer.indexOf(child.$e)
      if(appendIdx > -1) {
        this._appendBuffer.splice(appendIdx, 1)        
      }
      
      var self = this
      
      if(this._removeAnimationFrameId) {
        return
      }
      
      this._removeAnimationFrameId = window.requestAnimationFrame(function () {
        for(var i = 0; i < self._removeBuffer.length; i++) {
          self._removeBuffer[i].remove()
        }
        
        self._removeBuffer = []
        self._removeAnimationFrameId = null
      })
    }
  })
  
  return Controller
  
})(jQuery, window);