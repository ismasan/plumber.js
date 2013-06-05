Plumber.Utils = (function () {
  "use strict";
  
  function toArray(args, i) {
    i = i || 0;
    return Array.prototype.slice.call(args, i)
  }
  
  function chain (pipes) {
    var copy    = pipes.slice(0),
        current = copy.shift();
    
    $.each(copy, function (i, p) {
      current.pipe(p)
      current = p
    })
  }
  
  return {
    toArray: toArray,
    chain: chain
  }
})();