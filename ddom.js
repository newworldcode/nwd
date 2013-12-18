/*!Copyright Dave Mackintosh. MIT License. 2013*/
;(function (g) {
	'use strict';

	// For easier access later
	var AP = Array.prototype,
		EP = Element.prototype,
		HD = HTMLDocument.prototype;

	// A super simple selection engine
	g.$ = function (s, p) {
		p = p || document;
		if (type(s, 'string')) {
			return AP.slice.call(p.querySelectorAll(s));
		} else {
			return [s];
		}
	};

	// Remove an element from the DOM
	EP.remove = function () {
		this.parentNode.removeChild(this);
	};

	// Set or retrieve data on an object
	EP.data = function (k, v) {
		if (type(v, "undefined")) {
			return this.data(k);
		} else {
			this.data(k, v);
		}
	};

	// Return the nodes class List
	EP.classes = function () {
		return this.classList ? this.classList : [];
	}

	// Util function for type checking
	function type(o, e) {
		var type = (typeof o).toLowerCase();
		return e ? type === e : type;
	}

	// Event delegation
	function delegate(event, selector, callback) {
		// Get the event and the source of the event
		event = event || window.event;
		var target = event.target || event.srcElement;

		// If we don't have a selector, just callback
		if (!type(selector, 'string')) {
			return callback(event);
		}

		// If we do have a selector, get the elements
		$(selector, target.parentNode).each(function () {
			if (this === target) {
				callback.call(this, event);
			}
		});
	}

	// Add an each function to call like jQueries
	AP.each = function (cb) {
		this.forEach(function (e) {
			cb.call(e, e);
		});
		return this;
	};

	// Add an on method to the array prototype
	// For simple recursive event listening
	HD.on = AP.on = function (handles, delegated, callback, capture) {
		// Store the array
		var array = this;

		// Whether we're capturing or not
		capture = !type(capture, 'boolean') && type(callback, 'boolean') ? callback : capture;

		// Loop over the events
		handles.split(' ').forEach(function (individual_handle) {
			// Then loop over the elements
			array.each(function (e) {
				e.addEventListener(individual_handle, function (event) {
					if (type(delegated, 'function')) {
						return delegated.call(this, event);
					}

					return delegate(event, delegated, callback);
				}, capture);
			});
		});
		return this;
	};

	// Add an off method to the array prototype
	// To remove event listeners
	HD.off = AP.off = function (handle, callback, capture) {
		capture = capture || false;
		this.each(function (e) {
			e.removeEventListener(handle, callback, capture);
		});
		return this;
	};

})(this);
