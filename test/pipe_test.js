describe('Bootic.Pipe', function () {
  var context = {};
  
  beforeEach(function () {
    context.pipe1 = new Bootic.Pipe()
  })
  
  behavesLikeAPipe(context)
  
})