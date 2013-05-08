/*!
 * Plumber - BasicObject
 * Borrowed largely from Backbone.js https://github.com/documentcloud/backbone
 * Copyright (C) 2013 Ismael Celis
 * MIT Licensed
 *
 * @object
 *
 * Base for extensible "classes" with event binding support
 *
 * Usage:
 *
 *    var User = Plumber.BasicObject.extend({
 *      initialize: function (name) {
 *        this.name = name
 *      }
 *    })
 */
Plumber.BasicObject = (function ($) {
  "use strict";
  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    $.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) $.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };
  
  // Basic extensible object.
  var BasicObject = function () {
    this.preInitialize.apply(this, arguments);
    this.initialize.apply(this, arguments);
  }
  BasicObject.extend = extend;

  BasicObject.prototype = {
    initialize: function () {},
    preInitialize: function () {}
  }
  
  // Events mixin
  $.extend(BasicObject.prototype, Plumber.Events);
  
  return BasicObject
})(jQuery)