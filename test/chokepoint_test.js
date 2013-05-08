describe('Bootic.Devices.ChokePoint', function () {
  var TestPipe, chokePoint, p1, p2, p3, struct, switch1, switch2;
  
  describe('as pipe', function () {
    var t1, t2, context = {}
    
    beforeEach(function () {
      t1    = new Bootic.Pipe()
      t2    = new Bootic.Pipe()
      context.pipe1 = new Bootic.Devices.ChokePoint(t1, t2)
    })
    
    behavesLikeAPipe(context)
  })
  
  describe('#add()', function () {
    
    beforeEach(function () {
      struct        = new Bootic.Struct()
      results       = new Bootic.Pipe()
      
      switch1       = $.Deferred()
      switch2       = $.Deferred()
      p1            = deferredTestPipe(switch1, '_add')
      p2            = deferredTestPipe(switch2, '_add')
      chokePoint    = new Bootic.Devices.ChokePoint(p1, p2)
      
      chokePoint.pipe(results)
      
      spyOn(p1, 'add').andCallThrough()
      spyOn(p2, 'add').andCallThrough()
      spyOn(results, 'add')
    })
    
    it("calls #add() on children in parallel", function () {
      chokePoint.add(struct)
      expect(p1.add).toHaveBeenCalledWith(struct)
      expect(p2.add).toHaveBeenCalledWith(struct)
    })
    
    it("does not pipe results if pipelined children don't resolve", function () {
      chokePoint.add(struct)
      expect(results.add).not.toHaveBeenCalled()
    })
    
    it('only pipes results when all children have resolved', function () {
      chokePoint.add(struct)
      switch1.resolve()
      expect(results.add).not.toHaveBeenCalled()
      switch2.resolve()
      expect(results.add).toHaveBeenCalledWith(struct)
    })
    
  })
  
  describe('#remove()', function () {
    
    beforeEach(function () {
      struct        = new Bootic.Struct()
      results       = new Bootic.Pipe()
      
      switch1       = $.Deferred()
      switch2       = $.Deferred()
      p1            = deferredTestPipe(switch1, '_remove')
      p2            = deferredTestPipe(switch2, '_remove')
      chokePoint    = new Bootic.Devices.ChokePoint(p1, p2)
      
      chokePoint.pipe(results)
      
      spyOn(p1, 'remove').andCallThrough()
      spyOn(p2, 'remove').andCallThrough()
      spyOn(results, 'remove')
    })
    
    it("calls #remove() on children in parallel", function () {
      chokePoint.remove(struct)
      expect(p1.remove).toHaveBeenCalledWith(struct)
      expect(p2.remove).toHaveBeenCalledWith(struct)
    })
    
    it("does not pipe results if pipelined children don't resolve", function () {
      chokePoint.remove(struct)
      expect(results.remove).not.toHaveBeenCalled()
    })
    
    it('only pipes results when all children have resolved', function () {
      chokePoint.remove(struct)
      switch1.resolve()
      expect(results.remove).not.toHaveBeenCalled()
      switch2.resolve()
      expect(results.remove).toHaveBeenCalledWith(struct)
    })
    
  })
  
})