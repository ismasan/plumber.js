describe('Plumber.Devices.TimedAggregator', function () {
  var p1, p2, Counter, struct;
  
  beforeEach(function () {

    Counter = Plumber.Devices.TimedAggregator.extend({
      startValues: {
        count: 0
      },

      aggregate: function (mem, struct) {
        mem.set('count', mem.get('count') + 1)
      }
    })
    
    jasmine.Clock.useMock();
    struct    = new Plumber.Struct()
    p1        = new Counter(100)
    p2        = new Plumber.Pipe()
    
    p1.pipe(p2)
  })
  
  it('it aggregates struct until timeout has elapsed', function () {
    var ins = []
    p2.on('add', function (struct) { ins.push(struct.get('count')) })
    
    p1.add(new Plumber.Struct())
    p1.add(new Plumber.Struct())
    p1.add(new Plumber.Struct())
    
    // advance clock
    jasmine.Clock.tick(101);
    
    expect(ins).toEqual([3])
  })
  
})