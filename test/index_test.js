describe('Bootic.Index', function () {
  
  var s1, s2, index, context = {};
  
  beforeEach(function () {
    s1 = new Bootic.Struct();
    s2 = new Bootic.Struct();
    index = new Bootic.Index();
    
    index.add(s1)
    index.add(s2)
    
    // shared behaviours
    context.pipe1 = index;
  })
  
  behavesLikeAPipe(context)
  
  describe('#add()', function () {
    
    it('wraps raw objects in structs', function () {
      index.add({name: 'foo'})
      expect(index._list.length).toEqual(3)
      expect(index._list[2].get('name')).toBe('foo')
    })
    
    it('keeps track of structs', function () {
      expect(index._list).toEqual([s1,s2])
    })
    
    it('does not add the same struct twice', function () {
      index.add(s1)
      expect(index._list).toEqual([s1,s2])
    })
    
    it('triggers `update` on itself when updating existing item', function () {
      var spy = jasmine.createSpy('update spy')
      index.on('update', spy)
      index.add(s1)
      
      expect(spy).toHaveBeenCalledWith(s1)
    })
  })
  
  describe('#remove()', function () {
    it('removes from index', function () {
      index.remove(s1)
      expect(index._list).toEqual([s2])
    })
  })
  
  describe('#pipe()', function () {
    it('adds existing items', function () {
      var pipe  = new Bootic.Pipe(),
          spy   = jasmine.createSpy('pipe spy');
      
      pipe.on('add', spy);
      
      index.pipe(pipe)
      
      expect(spy).toHaveBeenCalledWith(s1)
      expect(spy).toHaveBeenCalledWith(s2)
    })
  })
})