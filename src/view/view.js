Bootic.View = (function ($, window) {
  
  var RivetsItemView = Bootic.BasicObject.extend({
    initialize: function (item, $e) {
      this.$e = $e
      this.bindings = rivets.bind(this.$e, {item: item})
    },
    
    destroy: function () {
      this.bindings.unbind()
      return this
    }
  })
  
  var View = Bootic.Pipe.extend({
    
    itemView: RivetsItemView,
    appendMethod: 'append',
    
    initialize: function (source, $e) {
      this.source = source;
      this.$e = $e;
      this.$container = this.$e.find('[data-item]');
      this.appendMethod = this.$container.data('item') || this.appendMethod
      this.$itemElement = this.$container.children().remove()
      
      this.appender = new Bootic.DomAppender(this.$container)
      
      this._children = {}

      source.pipe(this)
    },
    
    _add: function (item, promise) {
      // create and index child view
      var child = new this.itemView(item, this.$itemElement.clone())
      this._children[item.id()] = child
      
      this.appender.append(child.$e, this.appendMethod)
      
      promise.resolve(item)
    },
    
    _remove: function (item, promise) {
      // unbind, destroy and de-index child-view
      var child = this._children[item.id()].destroy()
      this.appender.remove(child.$e)
      delete this._children[item.id()]
      
      promise.resolve(item)
    }
  })
  
  return View
  
})(jQuery, window);