selfDoc.js: JavaScript that Documents Itself
============================================

_selfDoc_ is a JavaScript function that takes a function or object literal (containing a JavaScript application built in a modular style) and returns an object that describes the application's API. This can be combined with a templating tool (_[lm.js][1]_, perhaps) to produce a dynamic HTML document.

  var test = function () {
    // A function that does nothing
  };
  test.subFunction = function () {
    // Another useless function
  };
  selfDoc("Test", test, "A test application using selfDoc.js");
  // Returns an object describing the app
  /**
  {
    appName: "Test",
    comment: ["A function that does nothing"],
    overview: "A test application using selfDoc.js"
    properties: [{
      name: "subFunction"
      comment: ["Another useless function"],
      implementation: "function () { ... }"
    }]
  }
  */

The documentation is refreshed every time _selfDoc_ is called. _selfDoc_ can be kept alongside unit tests or demos providing a dynamic set of documentation that is always up to date. Combine the resulting object with your favorite templating tool and you have dynamic HTML documentation.

_selfDoc_ is low on dependencies, a browser is the only requirement. _selfDoc_ coerces the public/current-scope functions to strings, extracting their comments (FireFox/JaegerMonkey removes comments at run time, so functionality is hampered here).

LM.JS by [Joel Hughes][2] is licensed under a Creative Commons Attribution 3.0 Unported License

[1]: https://github.com/rudenoise/LM.JS
[2]: http://www.joelhughes.co.uk
