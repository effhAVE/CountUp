// https://github.com/danro/jquery-easing/blob/master/jquery.easing.js

/*  HOW TO USE:
*
*   Init via HTML:
*       <div data-counter="numberToCountTo"></div>
*     You can pass multiple attributes:
*       <div data-counter="numberToCountTo" data-start="startingNumber" data-decimals="decimalPlaces" data-duration="duration(in seconds)"></div>
*       Don't forget to initialize it with new CountUp();!
*
*   Or init entirely with JavaScript:
*       const countUp = new CountUp();
*       countUp.initCounter({ selector: document.querySelector("#example1"), easingFunc: "easeInOutQuad", duration: 10, counter: 1580 });
*
*       You can pass either your own easing function or one of the following: "easeInOutQuad", "easeInOutQuint", "easeInOutSine" (default)
*       You can also provide default settings when creating new instance of CountUp, like this: new CountUp({duration: 8});
*/


class CountUp {
    constructor(config) {
        // config is an object to define own global settings to all counters (in other words settings that will be inherited if no other, a single-counter-specific values will be provided)
        // supported values:
        //  start: a starting value (default: 0)
        //  duration: self-explanatory (default: 4)
        //  decimals: number of decimal places to be shown
        //  easingFunc: function to run animation (default: easeInOutSine)
        this.easings = {
            /*
            t: current time/step
            b: starting position
            c: amount of change (end - start)
            d: total time/steps
            */
            easeInOutQuad(t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t + b;
                return -c / 2 * ((--t) * (t - 2) - 1) + b;
            },

            easeInOutQuint(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t * t * t * t + b;
                t -= 2;
                return c / 2 * (t * t * t * t * t + 2) + b;
            },

            easeInOutSine(t, b, c, d) {
                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
            }
        };

        const defaults = {
            easingFunc: this.easings.easeInOutSine,
            start: 0,
            duration: 4,
            decimals: 0
        };

        // Array that will store all DOMElement-related counters
        this.countersArray = [];
        // And the final config, consisting of combined default and provided values
        this.config = {
            ...defaults,
            ...config
        };

        document.querySelectorAll("[data-counter]").forEach(el => {
            // For each DOMElement that has data-counter attribute we initialize the counter
            // Create an options object and append selector key to it
            let options = {
                selector: el
            }

            // If a user added other data attributes we add options keys accordingly
            for (const [key, val] of Object.entries(el.dataset)) {
                options[key] = val;
            }

            // We initialize it by passing options object to the init function.
            this.initCounter(options);
            // And add a number to the element so it's not blank when we scroll into it
            el.innerText = options.start || 0;
        });

        ["scroll", "load"].forEach(type => {
            // For both scroll and load events we add an event listener which will check if any not activated counter is in the viewport
            // If it is we launch count() method to fire counting
            function isScrolledIntoView(el) {
                const rect = el.getBoundingClientRect();
                const elemTop = rect.top;
                const elemBottom = rect.bottom;
                const isVisible = elemTop < window.innerHeight && elemBottom >= 0;
                return isVisible;
            }

            window.addEventListener(type, () => {
                this.countersArray
                    .filter(el => !(el.running || el.finished))
                    .forEach(el => {
                        isScrolledIntoView(el.selector) ? this.count(el) : null;
                    });
            });
        });
    }

    initCounter(options) {
        // For given options object we fill it out with global config properties that were not provided
        options = {
            ...this.config,
            ...options
        };
        // And then destructure it for easier use
        let {
            start,
            counter,
            duration,
            decimals,
            easingFunc,
            selector
        } = options;
        // If the user provided easing function name, we assign a corresponding function to the variable (or the default one if it wasn't found)
        if (typeof easingFunc === "string") {
            easingFunc = this.easings[easingFunc] || this.config.easingFunc;
        }

        // We push created counter object to counters array
        return this.countersArray.push({
            start: +start,
            counter: +counter,
            duration: +duration,
            decimals: +decimals,
            decimalsMultiplier: 1 * Math.pow(10, +decimals),
            curr: +start,
            time: 0,
            difference: +counter - +start,
            easingFunc: easingFunc,
            selector: selector,
            running: false,
            finished: false
        });
    }

    count(c) {
        // If the counter is either running or finished don't do anything
        if (c.running || c.finished) {
            return;
        }

        c.running = true;
        // Interval set to 10ms to prevent setInterval method from "staying behind" (lower c.time increase compared to function execution delay, resulting in prolonged duration). 
        // While 4ms is minimum as per spec it doesn't make much difference compared to 10ms
        let intervalRatio = 0.01;
        c.handler = setInterval(() => {
            c.time += intervalRatio;
            c.curr = c.easingFunc(c.time, c.start, c.difference, c.duration);
            if (c.time >= c.duration) {
                clearInterval(c.handler);
                c.running = false;
                c.finished = true;
                c.curr = c.counter;
            }

            c.selector.innerText = Math.floor(c.curr * c.decimalsMultiplier) / c.decimalsMultiplier;
        }, intervalRatio * 1000);
    }
}