###ddom.js

A VERY simple and basic query engine like jQuery without all the vestigial crap, use the same as you would jQuery

    $('a').each(function (e) {
        // this and the argument e are both the element at the index
    });
    
###delegation

    $('section').on('click', 'button', function (e) {
	console.log(e, this); // e = the event and this is the target
    });
    
####I would just read the docblocks though, it's simples.
