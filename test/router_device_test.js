describe('Plumber.Devices.Router', function () {
  
  var router, p1, p2, p3;
  
  beforeEach(function () {
    struct = new Plumber.Struct()
    
    router  = new Plumber.Devices.Router()
    p1      = new Plumber.Pipe()
    p2      = new Plumber.Pipe()
    p3      = new Plumber.Pipe()
    
    router
      .route(p1, function (struct, promise) {
        if(struct.get('name') == 'John' && struct.get('last_name') == 'Doe') promise.resolve()
        else promise.reject()
      })
      .route(p2, function (struct, promise) {
        if(struct.get('name') == 'John') promise.resolve()
        else promise.reject()
      })
      .default(p3)
  })
  
  describe('#add()', function () {
    
    it('picks the right route', function () {
      var struct = new Plumber.Struct({name: 'John', last_name: 'Doe'})
      spyOn(p1, 'add')
      spyOn(p2, 'add')
      spyOn(p3, 'add')
      
      router.add(struct)
      
      expect(p1.add).toHaveBeenCalledWith(struct)
      expect(p2.add).not.toHaveBeenCalled()
      expect(p3.add).not.toHaveBeenCalled()
      
      p1.add.reset()
      
      var struct = new Plumber.Struct({name: 'John', last_name: 'Smith'})
      router.add(struct)
      
      expect(p1.add).not.toHaveBeenCalled()
      expect(p2.add).toHaveBeenCalledWith(struct)
      expect(p3.add).not.toHaveBeenCalled()
      
      p2.add.reset()
      
      var struct = new Plumber.Struct({name: 'Joe', last_name: 'Bloggs'})
      router.add(struct)
      
      expect(p1.add).not.toHaveBeenCalled()
      expect(p2.add).not.toHaveBeenCalled()
      expect(p3.add).toHaveBeenCalledWith(struct)
    })
    
  })
  
  describe('#remove()', function () {
    
    it('picks the right route', function () {
      var struct = new Plumber.Struct({name: 'John', last_name: 'Doe'})
      spyOn(p1, 'remove')
      spyOn(p2, 'remove')
      spyOn(p3, 'remove')
      
      router.remove(struct)
      
      expect(p1.remove).toHaveBeenCalledWith(struct)
      expect(p2.remove).not.toHaveBeenCalled()
      expect(p3.remove).not.toHaveBeenCalled()
      
      p1.remove.reset()
      
      var struct = new Plumber.Struct({name: 'John', last_name: 'Smith'})
      router.remove(struct)
      
      expect(p1.remove).not.toHaveBeenCalled()
      expect(p2.remove).toHaveBeenCalledWith(struct)
      expect(p3.remove).not.toHaveBeenCalled()
      
      p2.remove.reset()
      
      var struct = new Plumber.Struct({name: 'Joe', last_name: 'Bloggs'})
      router.remove(struct)
      
      expect(p1.remove).not.toHaveBeenCalled()
      expect(p2.remove).not.toHaveBeenCalled()
      expect(p3.remove).toHaveBeenCalledWith(struct)
    })
    
  })
  
  describe('#pipe()', function () {
    it('raises because it makes no sense for a router to pipe', function () {
      expect(function () {
        router.pipe(p1)
      }).toThrow()
    })
  })
  
})