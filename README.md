#NWD
New World DOM is a very small, simple, fast and modern dom query helper.  

```js
$('a').each(function (link) {
  // `this` and `link` are the same thing
})
```
    
It also supports event delegation  

```js
$('body').on('click', 'button', function (event) {
  console.log('A button got pressed!', this, event)
})
```

A result set from `$('selector')` has a virtual length property so `$('p').length > 0` will function as usual.  

#### `$('selector').on(eventName, [delegate], callback)`  
Add listeners to any elements with support for event delegation.

#### `$('selector').off(eventName, callback)`  
Remove listeners from any elements.

#### `$('selector').get(index)`  
Get a specific node from a set of results or undefined for out of bounds.

#### `$('selector').parent()`  
Get a nodes `parentNode` wrapped in an NWD result set for chaining.

#### `$('selector').each([iterator])`  
Loop over a result set, `this` is scoped to the element in current scope. The iterator is invoked with two arguments `element, index`

#### `$('selector').filter([iterator])`  
Filter a result set, `this` is scoped to the element in current scope. The iterator is invoked with two arguments `element`
