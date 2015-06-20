/*! Copyright New World Code. MIT License. 2013-2015 */
(function (g) {
  'use strict'

  /**
   * Main construct
   * @param  {string|Element} selector Valid selector string
   * @param  {Element} parent The Element in which to scope this selector
   * @return {$OM}
   */
  function $OM(selector, parent) {
    this.results = []
    this.scope   = parent || document

    // Different behaviour for selector and Element
    if (type(selector, 'string'))
      this.results = [].slice.call(this.scope.querySelectorAll(selector))
    else
      this.results = [selector]

    return this
  }

  // Shorten the call.
  var op = $OM.prototype

  // Add a getter for length for checking results of the selector.
  Object.defineProperty(op, "length", {
    __proto__: null,
    enumerable: true,
    get: function lengthGetter() {
      return this.results.length
    }
  })

  /**
   * Check the type of something
   * @param  {any} ofThis The thing to check typeof
   * @param  {any} equals Is the type equal to this?
   * @return {Bool|String} boolean of match or the typeof
   */
  function type(ofThis, equals) {
    var type = (typeof ofThis).toLowerCase()
    return equals ? type === equals : type
  }

  /**
   * Get one of the results at an index
   * @param  {Number} index Index to fetch at
   * @return {Element|null}
   */
  op.get = function get(index) {
    return this.results[index || 0]
  }

  /**
   * Add a series of event listeners, space delimited
   * to the last list of results.
   * Supports event delegation.
   * @param  {string}   handles   Space delimited event handlers.
   * @param  {selector} delegated Delegate event to this selector.
   * @param  {Function} callback  Callback to fire on event.
   * @param  {Boolean}  capture   Whether to capture the event.
   * @return {$OM}
   */
  op.on = function on(handles, delegated, callback, capture) {
    // Store the array
    var array = this.results

    // Whether we're capturing or not
    capture = !type(capture, 'boolean') && type(callback, 'boolean') ? callback : capture

    // Loop over the events
    handles.split(' ').forEach(function eventHandleLoop(individual_handle) {
      // Then loop over the elements
      array.forEach(function resultsLoop(e) {
        e.addEventListener(individual_handle, function eventHandleRegister(event) {
          if (type(delegated, 'function'))
            delegated.call(event.target, event)
          else
            delegate(event, delegated, callback)
        }, capture)
      })
    }.bind(this))

    return this
  }

  /**
   * Unsubscribe from a series of events.
   * @param  {string}   handles  Space delimited event handlers.
   * @param  {Function} callback Callback to fire
   * @param  {Capture}  capture  Whether to capture the event.
   * @return {$OM}
   */
  op.off = function off(handles, callback, capture) {
    capture = capture || false
    handles.split(' ').forEach(function eventHandleLoop(individual_handle) {
      this.results.forEach(function resultsLoop(e) {
        e.removeEventListener(individual_handle, callback, capture)
      })
    }.bind(this))
    return this
  }

  /**
   * Return a wrapped parentNode of the first element in our results list,
   * or return null.
   *
   * @return {$OM}
   */
  op.parent = function parent() {
    if (this.results.length > 0)
      return new $OM(this.results[0].parentNode)
    else
      return null
  }

  /**
   * Loop over the last known set of results from a selector.
   * @param  {Function} cb Callback for each element.
   * @return {$OM}
   */
  op.each = function each(cb) {
    this.results.forEach(function eachForEach(e) {
      cb.apply(e, arguments)
    })
    return this
  }

  /**
   * The on method uses this private method to delegate events
   * @param  {event}    event    event to delegate.
   * @param  {string}   selector valid selector string.
   * @param  {Function} callback Callback to fire
   * @return {void}
   */
  function delegate(event, selector, callback) {
    // Get the event and the source of the event
    event = event || window.event
    var target = event.target || event.srcElement

    // If we don't have a selector, just callback
    if (!type(selector, 'string')) return callback(event)

    // If we do have a selector, get the elements
    new $OM(selector, target.parentNode).each(function scopedDelegateLoop() {
      if (this === target) callback.call(this, event)
    })

    return this
  }

  /**
   * Friendly construct for the library.
   * @param  {string} s valid selector.
   * @param  {Element} p Element to scope selector to.
   * @return {$OM}
   */
  g.$ = function (s, p) {
    return new $OM(s, p)
  }

})(window)
