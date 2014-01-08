/*!Copyright Dave Mackintosh. MIT License. 2013*/
;(function (g) {
	'use strict';
	
  function $OM(selector, parent) {
    this.results = [];
    this.scope   = parent || document;

    if (helpers.type(selector, 'string')) {
      this.results = Array.prototype.slice.call(this.scope.querySelectorAll(selector));
    } else {
      this.results = [selector];
    }

    return this;
  }

  var op = $OM.prototype;

  op.get = function(index) {
    var index = index || 0;
    return this.results[index];
  }

  op.on = function(handles, delegated, callback, capture) {
    // Store the array
    var array = this.results;

    // Whether we're capturing or not
    capture = !helpers.type(capture, 'boolean') && helpers.type(callback, 'boolean') ? callback : capture;

    // Loop over the events
    handles.split(' ').forEach(function (individual_handle) {
      // Then loop over the elements
      array.forEach(function (e) {
        e.addEventListener(individual_handle, function (event) {
          if (helpers.type(delegated, 'function')) {
            return delegated.call(this, event);
          }

          return delegate(event, delegated, callback);
        }, capture);
      });
    }.bind($OM));

    return this;
  };

  op.off = function(handles, callback, capture) {
    capture = capture || false;
    handles.split(' ').forEach(function (individual_handle) {
      this.results.forEach(function (e) {
        e.removeEventListener(individual_handle, callback, capture);
      });
    }.bind(this));
    return this;
  };

  op.each = function(cb) {
    this.results.forEach(function (e) {
      cb.apply(e, arguments);
    });
    return this;
  };

  op.remove = function() {
    this.results.forEach(function(e) {
      e.parentNode.removeChild(e);
    });
  };

  function delegate(event, selector, callback) {
    // Get the event and the source of the event
    event = event || window.event;
    var target = event.target || event.srcElement;

    // If we don't have a selector, just callback
    if (!helpers.type(selector, 'string')) {
      return callback(event);
    }

    // If we do have a selector, get the elements
    new $OM(selector, target.parentNode).each(function () {
      if (this === target) {
        callback.call(this, event);
      }
    });
  }

  g.$ = function (s, p) {
    return new $OM(s, p);
  };

})(this);
