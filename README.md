# CountUp.js
CountUp.js is a simple, dependency-free, vanilla JavaScript library written by [me](http://have.com.pl). While it's still under development it has basic features that may come in handy when you just don't want to download jQuery to animate that one number.
### [Check out demo!](https://effhave.github.io/CountUp/demo.html)
# How to use:
All you need to do is create a new instance, like this:
```javascript
new CountUp(config);
// we can also assign it to a variable for later use
const countUp = new CountUp();
```
Now we are good to go!
## Global config
`config` object is used as a way to define own global settings to all counters (in other words settings that will be inherited if no other, single-counter-specific values will be provided). If no value is present the default settings are used.
Supported values:
* **start** (Number): a starting value (default: *0*)
* **duration** (Number, in seconds): self-explanatory (default: *4*)
* **decimals** (Number): number of decimal places to be shown (default: *0*)
* **easingFunc** (Function, String): function to run animation (default: *f easeInOutSine*)
You can pass either your own easing function or one of the following: `"easeInOutQuad"`, `"easeInOutQuint"`, `"easeInOutSine"` (default)
Examples:
```javascript
new CountUp(); // everything default
new CountUp({ duration: 8 }); // everything default but duration
new CountUp({ easingFunc: "easeInOutQuad", duration: 10 }); // and so on...
new CountUp({ easingFunc: easeOutBounce, duration: 10, decimals: 1 });
```
## Initializing a counter
* ### with HTML
To initialize with HTML you need to add `data-counter` attribute:
```html
<div data-counter="numberToCountTo"></div>
```
You can pass multiple attributes, adding their corresponding data-option names and values:
```html
<div data-counter="numberToCountTo" data-start="startingNumber" data-decimals="decimalPlaces" data-duration="duration"></div>
```
Same naming conceptions are used both in HTML data attributes and JavaScript.
Unfortunately if you want to use a custom easing function you need to initialize with JavaScript.
Also, for obvious reasons a `data-selector` attribute is not supported. That'd be stupid, right?

* ### with JavaScript
```javascript
const countUp = new CountUp();
countUp.initCounter(options);
```
`options` is an object which currently supports following keys:
* **selector** (Element): DOMElement which will be used as a container
* **counter** (Number): counter stopping value
* Everything else used in global config

Examples:
```javascript
const countUp = new CountUp();
countUp.initCounter({ selector: document.querySelector("#example1"), easingFunc: "easeInOutQuad", duration: 10, counter: 1580 });
countUp.initCounter({ selector: document.querySelector("#example2"), easingFunc: easeOutBounce, duration: 10, counter: 1580 });
```
## Custom easing functions
To be continued...
