beforeEach(function () {
  Bootic.Logger.logging = true;
})

// Shared behaviours
function behavesLikeAPipe(context) {

  describe('behaves like a Pipe', function () {
    var pipe1, pipe2, pipe3, addSpy, removeSpy, struct;

    beforeEach(function () {
      pipe1     = context.pipe1;
      pipe2     = new Bootic.Pipe()
      pipe3     = new Bootic.Pipe()
      addSpy    = jasmine.createSpy('add')
      removeSpy = jasmine.createSpy('remove')
      struct    = new Bootic.Struct({id: 1})
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
        expect(spy).toHaveBeenCalledWith(struct);
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

        pipe3.on('add', addSpy)

        pipe1.pipe(pipe2).pipe(pipe3);

        pipe1.add(struct);

        expect(addSpy).toHaveBeenCalledWith(struct);
      })
      
      it('forwards removed structs from one pipe to the other', function () {

        pipe3.on('remove', removeSpy)

        pipe1.pipe(pipe2).pipe(pipe3);

        pipe1.add(struct);
        pipe1.remove(struct);

        expect(removeSpy).toHaveBeenCalledWith(struct);
      })
      
    })
    
  })
}