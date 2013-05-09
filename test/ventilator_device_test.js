describe('Plumber.Devices.Ventilator', function () {
  var in1, in2, out1, out2, ventilator, struct, results, context = {};
  
  describe('with null IN (fan-out)', function () {
    beforeEach(function () {
      out1 = new Plumber.Pipe()
      out2 = new Plumber.Pipe()

      struct = new Plumber.Struct()
      
      ventilator = new Plumber.Devices.Ventilator(null, [out1, out2])
    })
    
    it('pipes to all OUTs', function () {
      spyOn(out1, 'add')
      spyOn(out2, 'add')
      
      ventilator.add(struct)
      
      expect(out1.add).toHaveBeenCalledWith(struct)
      expect(out2.add).toHaveBeenCalledWith(struct)
    })
  })
  
  describe('with null OUT (fan-in)', function () {
    beforeEach(function () {
      in1 = new Plumber.Pipe()
      in2 = new Plumber.Pipe()
      results = new Plumber.Pipe()

      struct = new Plumber.Struct()
      
      ventilator = new Plumber.Devices.Ventilator([in1, in2])
      ventilator.pipe(results)
    })
    
    it('forwards from any IN to piped pipes', function () {
      spyOn(results, 'add')
      
      in1.add(struct)
      
      expect(results.add).toHaveBeenCalledWith(struct)
    })
  })
  
  describe('many to many', function () {
    beforeEach(function () {
      in1 = new Plumber.Pipe()
      in2 = new Plumber.Pipe()
      out1 = new Plumber.Pipe()
      out2 = new Plumber.Pipe()
      results = new Plumber.Pipe()

      struct = new Plumber.Struct()

      ventilator = new Plumber.Devices.Ventilator([in1, in2], [out1, out2])

      ventilator.pipe(results)
      context.pipe1 = ventilator
    })

    behavesLikeAPipe(context)

    describe('#add()', function () {

      it('pipes from any IN to all OUTs', function () {
        spyOn(out1, 'add')
        spyOn(out2, 'add')

        in1.add(struct)

        expect(out1.add).toHaveBeenCalledWith(struct)
        expect(out2.add).toHaveBeenCalledWith(struct)

        out1.add.reset()
        out2.add.reset()

        in2.add(struct)

        expect(out1.add).toHaveBeenCalledWith(struct)
        expect(out2.add).toHaveBeenCalledWith(struct)
      })

      it('pipes from itself to all OUTs', function () {
        spyOn(out1, 'add')
        spyOn(out2, 'add')

        ventilator.add(struct)

        expect(out1.add).toHaveBeenCalledWith(struct)
        expect(out2.add).toHaveBeenCalledWith(struct)
      })

      it('pipes from any IN to piped pipe', function () {
        spyOn(results, 'add')

        in1.add(struct)

        expect(results.add).toHaveBeenCalledWith(struct)
      })
    })

    describe('#remove()', function () {

      it('pipes from any IN to all OUTs', function () {
        spyOn(out1, 'remove')
        spyOn(out2, 'remove')

        in1.remove(struct)

        expect(out1.remove).toHaveBeenCalledWith(struct)
        expect(out2.remove).toHaveBeenCalledWith(struct)

        out1.remove.reset()
        out2.remove.reset()

        in2.remove(struct)

        expect(out1.remove).toHaveBeenCalledWith(struct)
        expect(out2.remove).toHaveBeenCalledWith(struct)
      })

      it('pipes from itself to all OUTs', function () {
        spyOn(out1, 'remove')
        spyOn(out2, 'remove')

        ventilator.remove(struct)

        expect(out1.remove).toHaveBeenCalledWith(struct)
        expect(out2.remove).toHaveBeenCalledWith(struct)
      })

      it('pipes from any IN to piped pipe', function () {
        spyOn(results, 'remove')

        in1.remove(struct)

        expect(results.remove).toHaveBeenCalledWith(struct)
      })
    })
  })
  
})