/*!
 * Bootic - Logger
 * Copyright (C) 2013 Ismael Celis
 * MIT Licensed
 *
 * Usage:
 *   logger = new Bootic.Logger('some label')
 *   logger.info('Hi there')
 *
 *   logger.bind('log:error', callback)
 *
 *   Bootic.Logger.logging = [true|false]
 *   Bootic.Logger.level = [all|info|warn|error]
 *
 */
Bootic.Logger = (function ($, window) {
  "use strict";
  
  var hasConsole = ('console' in window);
  
  function log(level, label, message) {
    if(!hasConsole) return false;
    var t = new Date().toString()
    window.console[level](t + " ["+ label +"] " + message)
  }
  
  function logWith (level) {
    return function (message) {
      this.trigger('all', [message])
      this.trigger('log:' + level, [message])
      if(this.constructor.logging && (this.constructor.level == 'all' || this.constructor.level == level)){
        log(level, this.label, message)
      }
    }
  }
  
  var Logger = Bootic.BasicObject.extend({
    initialize: function (label) {
      this.label = label;
    },
    log: logWith('info'),
    info: logWith('info'),
    warn: logWith('warn'),
    error: logWith('error')
  }, {
    logging: false,
    level: 'all'
  })
  
  return Logger
  
})(jQuery, window);