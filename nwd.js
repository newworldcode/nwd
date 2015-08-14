/*!Copyright New World Code. MIT License. 2013*/
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
 * When the document is ready to be transformed,
 * fire this callback. Only happens once.
 *
 * @param  {Function} callback
 * @return {$OM}
 */
op.ready = function documentReady(callback) {
  document.addEventListener('DOMContentLoaded', callback)

  return this
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
 * Append a node to the ones in scope.
 * @param  {Element} node to append
 * @return {$OM}
 */
op.append = function append(node) {
  this.results.forEach(function appendEach(selected_node) {
    if (node instanceof $OM)
      node.each(function innerAppendEach(inner_node) {
        selected_node.appendChild(inner_node)
      })
    else
      selected_node.appendChild(node)
  })

  return this
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
 * @return {$OM}
 */
op.parent = function parent() {
  if (this.results.length > 0)
    return new $OM(this.results[0].parentNode)
  else
    return null
}

/**
 * Get the list of classes on a node.
 * @return {TokenList|null}
 */
op.classes = function() {
  if (this.results.length > 1)
    return this.results.map(function classesResultsMap(result) {
      return result.classList
    })
  else if (this.results.length === 0)
    return null
  else
    return this.results[0].classList
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
 * Filter a result set.
 * @param  {Function} cb Callback for each element.
 * @return {$OM}
 */
op.filter = function filter(cb) {
  this.results.filter(function eachFilter(e) {
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
var nwd_out = function (s, p) {
  return new $OM(s, p)
}

// CommonJS.
if (typeof define === 'function' && define.amd) define([ 'nwd' ], nwd_out)
// AMD.
else if (typeof module === 'object' && module.exports) module.exports = nwd_out
// Browsers.
else this.$ = nwd_out
