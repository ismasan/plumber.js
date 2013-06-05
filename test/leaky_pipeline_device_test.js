describe('Plumber.Devices.LeakyPipeline', function () {
  var p1, p2, pipeline, struct, ins;
  
  beforeEach(function () {
    struct    = new Plumber.Struct()
    p1        = new Plumber.Pipe()
    p2        = new Plumber.Pipe()
    p3        = new Plumber.Pipe()
    results   = new Plumber.Pipe()
    
    pipeline  = new Plumber.Devices.LeakyPipeline(p1, p2, p3)
    pipeline.pipe(results)
    
    ins = []
    p1.on('add', function () { ins.push('p1') })
    p2.on('add', function () { ins.push('p2') })
    p3.on('add', function () { ins.push('p3') })
    results.on('add', function () { ins.push('results') })
  })
  
  describe('#add()', function () {
    it('pipes structs into pipes in the order they were passed', function () {

      pipeline.add(struct)

      expect(ins).toEqual(['p1', 'p2', 'p3', 'results'])
    })
  })
  
  describe('#remove()', function () {
    it('pipes structs into pipes in the order they were passed', function () {
      var ins = []
      p1.on('remove', function () { ins.push('p1') })
      p2.on('remove', function () { ins.push('p2') })
      p3.on('remove', function () { ins.push('p3') })
      
      results.on('remove', function () { ins.push('results') })

      pipeline.remove(struct)

      expect(ins).toEqual(['p1', 'p2', 'p3', 'results'])
    })
  })
  
})