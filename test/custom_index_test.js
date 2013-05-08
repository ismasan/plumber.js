describe('custom rolling index', function () {
  var RollingIndex, index, s1, s2, s3, s4, addSpy, removeSpy, context = {};
  
  beforeEach(function () {
    s1  = new Plumber.Struct()
    s2  = new Plumber.Struct()
    s3  = new Plumber.Struct()
    s4  = new Plumber.Struct()
    
    addSpy    = jasmine.createSpy('add')
    removeSpy = jasmine.createSpy('remove')
    
    RollingIndex = Plumber.Index.extend({
      limit: 3,
      
      _add: function (item, promise) {
        // remove first if limit reached
        if(this._list.length > this.limit - 1) this.remove(this._list[0])
        // add next
        return Plumber.Index.prototype._add.call(this, item, promise)
      }
      
    })
    
    index = new RollingIndex()
    context.pipe1 = index
  })
  
  behavesLikeAPipe(context)
  
  describe('adding', function () {
    
    beforeEach(function () {
      
      index.on('add', addSpy)
      index.on('remove', removeSpy)
      
      index.add(s1)
      index.add(s2)
      index.add(s3)
    })
    
    it('does not remove item if limit not reached yet', function () {
      expect(addSpy).toHaveBeenCalledWith(s1)
      expect(addSpy).toHaveBeenCalledWith(s2)
      expect(addSpy).toHaveBeenCalledWith(s3)
      
      expect(removeSpy).not.toHaveBeenCalled()
    })
    
    it('removes first item after limit is reached', function () {
      index.add(s4)

      expect(addSpy).toHaveBeenCalledWith(s4)
      
      expect(removeSpy).toHaveBeenCalledWith(s1)
      expect(removeSpy).not.toHaveBeenCalledWith(s2)
    })
  })
  
})