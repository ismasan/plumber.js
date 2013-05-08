describe('Bootic.Devices.Pipeline', function () {
  var p1, p2, pipeline, struct;
  
  beforeEach(function () {
    struct    = new Bootic.Struct()
    p1        = new Bootic.Pipe()
    p2        = new Bootic.Pipe()
    results   = new Bootic.Pipe()
    pipeline  = new Bootic.Devices.Pipeline(p1, p2)
    pipeline.pipe(results)
    
  })
  
  describe('#add()', function () {
    it('pipes structs into pipes in the order they were passed', function () {
      var ins = []
      p1.on('add', function () { ins.push('p1') })
      p2.on('add', function () { ins.push('p2') })
      results.on('add', function () { ins.push('results') })

      pipeline.add(struct)

      expect(ins).toEqual(['p1', 'p2', 'results'])
    })
  })
  
  describe('#remove()', function () {
    it('pipes structs into pipes in the order they were passed', function () {
      var ins = []
      p1.on('remove', function () { ins.push('p1') })
      p2.on('remove', function () { ins.push('p2') })
      results.on('remove', function () { ins.push('results') })

      pipeline.remove(struct)

      expect(ins).toEqual(['p1', 'p2', 'results'])
    })
  })
  
})