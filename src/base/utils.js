Plumber.Utils = (function () {
  "use strict";
  
  function toArray(args, i) {
    i = i || 0;
    return Array.prototype.slice.call(args, i)
  }
  
  return {
    toArray: toArray
  }
})();