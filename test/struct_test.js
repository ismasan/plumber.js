describe("Bootic.Struct", function() {
  var subject
  
  beforeEach(function () {
    subject = new Bootic.Struct({name: 'Ismael'})
  })
  
  it('initialises with attributes', function () {
    expect(subject.get('name')).toEqual('Ismael')
  })
  
  describe('#set and #get', function () {
    
    it('sets one attribute', function () {
      subject.set('lastName', 'Celis')
      expect(subject.get('lastName')).toEqual('Celis')
    })
    
    it('sets multiple attributes', function () {
      subject.set({name: 'foo', lastName: 'bar'})
      expect(subject.get('name')).toEqual('foo')
      expect(subject.get('lastName')).toEqual('bar')
    })
    
    it('triggers change:[attribute] for single attribute', function () {
      var spy = jasmine.createSpy()
      subject.on('change:name', spy)
      subject.set('name', 'foo')
      expect(spy).toHaveBeenCalled()
    })
    
    it('triggers change:[attribute] for many attributes', function () {
      var spyName = jasmine.createSpy(),
          spyAge = jasmine.createSpy()
          
      subject.on('change:name', spyName)
      subject.on('change:age', spyAge)
      
      subject.set({name: 'foo', age: 35})
      
      expect(spyName).toHaveBeenCalled()
      expect(spyAge).toHaveBeenCalled()
    })
  })
  
  describe('#has()', function () {
    it('returns true for attributes that exist', function () {
      expect(subject.has('name')).toBe(true)
    })
    
    it('returns false for attributes that do not exist', function () {
      expect(subject.has('height')).toBe(false)
    })
    
    it('returns true for attributes that exist but have falsy values', function () {
      subject.set('falsy1', false)
      subject.set('falsy2', null)
      subject.set('falsy3', 0)
      subject.set('falsy4', '')
      
      expect(subject.has('falsy1')).toBe(true)
      expect(subject.has('falsy2')).toBe(true)
      expect(subject.has('falsy3')).toBe(true)
      expect(subject.has('falsy4')).toBe(true)
    })
  })
  
  describe('#id()', function () {
    var a, b;
    
    beforeEach(function () {
      a = new Bootic.Struct()
      b = new Bootic.Struct()
    })
    
    it('generates one if not provided', function () {
      expect(a.id()).toBeTruthy()
    })
    
    it('generates different IDs each time', function () {
      expect(a.id()).not.toEqual(b.id())
    })
    
    it('uses `id` default attribute if passed', function () {
      var struct = new Bootic.Struct({name: 'foo', id: 'bar'})
      expect(struct.id()).toEqual('bar')
    })
  })
  
  describe('#id() with custom attribute name', function () {
    var customStruct;
    
    beforeEach(function () {
      customStruct = Bootic.Struct.extend({
        _id_field: 'theId'
      })
    })
    
    it('uses custom attribute instead', function () {
      var struct = new customStruct({name: 'foo', theId: 'lalala'})
      expect(struct.id()).toEqual('lalala')
    })
  })

});
