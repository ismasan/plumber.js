describe("Plumber.Struct", function() {
  var subject, attributes
  
  beforeEach(function () {
    attributes = {name: 'Ismael'}
    subject = new Plumber.Struct(attributes)
  })
  
  it('initialises with attributes', function () {
    expect(subject.get('name')).toEqual('Ismael')
  })
  
  it('initialises with a copy of attributes so as not to modify original object', function () {
    subject.set('name', 'John')
    expect(attributes.name).toEqual('Ismael')
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
  
  describe('#uid()', function () {
    var a, b;
    
    describe('defaults', function () {
      beforeEach(function () {
        a = new Plumber.Struct()
        b = new Plumber.Struct()
      })

      it('generates one if not provided', function () {
        expect(a.uid()).toBeTruthy()
      })

      it('generates different IDs each time', function () {
        expect(a.uid()).not.toEqual(b.uid())
      })
    })
    
    describe('_uid_field_name', function () {
      var CustomStruct;
      
      beforeEach(function () {
        CustomStruct = Plumber.Struct.extend({
          _uid_field_name: 'id'
        })
        
        a = new CustomStruct({id: 'aaa'})
        b = new CustomStruct({id: 'bbb'})
      })
      
      it('uses _uid_field_name if provided', function () {
        expect(a.uid()).toEqual('aaa')
        expect(b.uid()).toEqual('bbb')
      })
    })
    
  })

});
