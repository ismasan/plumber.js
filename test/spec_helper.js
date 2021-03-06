beforeEach(function () {
  Plumber.Logger.logging = true;
})

// Return a pipe instance that only resolves when passed promise is resolved
function deferredTestPipe (switchPromise, meth) {
  var p = new Plumber.Pipe()
  p[meth] = function (struct, promise) {
    switchPromise.done(function () {
      promise.resolve(struct)
    })
  }
  return p
}

// Shared behaviours
function behavesLikeAPipe(context) {

  describe('behaves like a Pipe', function () {
    var pipe1, pipe2, pipe3, spy, addSpy, removeSpy, struct;

    beforeEach(function () {
      spy       = {add: $.noop, remove: $.noop}
      pipe1     = context.pipe1;
      pipe2     = new Plumber.Pipe()
      pipe3     = new Plumber.Pipe()
      
      addSpy    = jasmine.createSpy('add spy')
      removeSpy = jasmine.createSpy('remove spy')
      
      spyOn(spy, 'add')
      spyOn(spy, 'remove')
      
      struct    = new Plumber.Struct({id: 1})
    })
    
    describe('#add()', function () {
      it('triggers `add` event', function () {
        pipe1.on('add', addSpy)
        pipe1.add(struct)
        expect(addSpy).toHaveBeenCalledWith(struct);
      })
      
      it('returns an add promise', function () {
        var spy = jasmine.createSpy('add promise spy')
        pipe1.add(struct).done(spy)
        expect(spy).toHaveBeenCalled()
        expect(spy.mostRecentCall.args[0]).toBe(struct) // might also pass event name
      })
    })
    
    describe('#remove()', function () {
      it('triggers `remove` event', function () {
        pipe1.on('remove', removeSpy)
        pipe1.add(struct)
        pipe1.remove(struct)
        expect(removeSpy).toHaveBeenCalledWith(struct);
      })
      
      it('returns a remove promise', function () {
        var spy = jasmine.createSpy('remove promise spy')
        pipe1.add(struct)
        pipe1.remove(struct).done(spy)
        expect(spy).toHaveBeenCalledWith(struct);
      })
    })
    
    describe('#pipe()', function () {

      it('forwards added structs from one pipe to the other', function () {
        spyOn(pipe3, 'add')
        pipe1.pipe(pipe2).pipe(pipe3);

        pipe1.add(struct);

        expect(pipe3.add).toHaveBeenCalledWith(struct);
      })
      
      it('forwards removed structs from one pipe to the other', function () {

        spyOn(pipe3, 'remove')

        pipe1.pipe(pipe2).pipe(pipe3);

        pipe1.add(struct);
        pipe1.remove(struct);

        expect(pipe3.remove).toHaveBeenCalledWith(struct);
      })
      
      it('does not pipe twice to the same pipe', function () {
        spyOn(pipe3, 'add')
        pipe1.pipe(pipe2).pipe(pipe3);
        pipe2.pipe(pipe3)

        pipe1.add(struct);

        expect(pipe3.add.callCount).toEqual(1);
      })
      
    })
    
    describe('rejected #filter', function () {
      
      beforeEach(function () {
        pipe1.filter = function (item, promise) { promise.reject(item) }
      })
      
      it('does not trigger `add` event', function () {
        pipe1.on('add', addSpy)
        
        pipe1.add(struct)
        expect(addSpy).not.toHaveBeenCalled()
      })
      
      it('does not pipe newly added structs to other Pipes', function () {
        var newStruct = new Plumber.Struct()
        
        spyOn(pipe2, 'add')
        
        pipe1.pipe(pipe2)
        
        pipe1.add(newStruct)
        expect(pipe2.add).not.toHaveBeenCalledWith(newStruct)
      })
      
      it('triggers `reject` utility event', function () {
        var spy = jasmine.createSpy('reject spy')
        pipe1.on('reject', spy)
        
        pipe1.add(struct)
        expect(spy).toHaveBeenCalledWith(struct);
      })
    })
    
  })
}