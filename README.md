JavaScript Quarantine
=====================

This little plugin will execute any JavaScript code or function in an isolated (quarantined) area,
limiting resource exposure and preventing any script from tampering with existing, external data.

Usage
-----

With a function, or unknown function safely :

    jsQ$(function() { var a = "Exceute some code here!"; });

Or execute a foreign JS string :

    jsQ$('var a = "Exceute some code here!";');

To get the `this` scope from the quarantined eval, simply assign the returned value :

    var scriptContext = jsQ$(function() { this.msg = "Hello world!"; });
    alert( scriptContext.msg );  // -> "Hello world!"

... or inject any `this` scope. Injecting a `this` scope can be useful when is is
desired to access local data (but nothing else) :

    jsQ$(function() { this.msg = "Hello world!"; }, { self: this });

    alert( this.msg );  // -> "Hello world!"

The quarantined script being executed will also dispose a global object, used as reference
if so desired. Thie `global` object may be specified (default {})

    var myGlobal = { foo: "Bar!" };
    jsQ$(function() { alert( global.foo ); }, { global: myGlobal });  // alert "Bar!"

Also, the quarantined script is evaluated outside any function, and it is possible to
expose some global values (through the window object for example) to the quarantine script.
For example:

    var SuperPlugin = ...;

    function someFunction() {
        jsQ$(function() { SuperPlugin.method(); }, { exposeExternalVars: "SuperPlugin" });
    };
