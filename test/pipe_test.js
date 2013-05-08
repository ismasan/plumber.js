describe('Plumber.Pipe', function () {
  var context = {};
  
  beforeEach(function () {
    context.pipe1 = new Plumber.Pipe()
  })
  
  behavesLikeAPipe(context)
  
})