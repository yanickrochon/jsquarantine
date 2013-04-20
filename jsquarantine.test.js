
// Define these variables in the Window (global) scope.
var scope = "window";
var bar = "hello";

/**
 * Test assertions
 */
var Assert = {
    areEqual:    function(e, a) { if (e != a)          throw "Assertion failed : " + a + " not equal " + e; },
    areNotEqual: function(e, a) { if (e == a)          throw "Assertion failed : " + a + " equals " + e; },
    areSame:     function(e, a) { if (e !== a)         throw "Assertion failed : " + a + " not same as " + e; },
    areNotSame:  function(e, a) { if (e === a)         throw "Assertion failed : " + a + " same as " + e; },
    isDefined:   function(a)    { if (a === undefined) throw "Assertion failed : expected value is undefined"; },
    isUndefined: function(a)    { if (a !== undefined) throw "Assertion failed : " + a + " is not undefined"; },
    isNull:      function(a)    { if (a !== null)      throw "Assertion failed : " + a + " is not null"; },
    isTrue:      function(a)    { if (a !== true)      throw "Assertion failed : " + a + " is false"; },
    isFalse:     function(a)    { if (a !== false)     throw "Assertion failed : " + a + " is true"; }
};


function startTests(out) {

var _print = function(o) {
    var _text = document.createTextNode(o);
    document.getElementById(out).appendChild(_text);

    if (console && console.log) {
        console.log(o);
    }
};


/**
 * Test 1 : check undefined
 */
var undefVars = ['window', 'document', 'scope', 'jsQ$', 'bar'];
for (var v in undefVars) {
    _print(new Date().toLocaleTimeString() + " : Testing undefined '" + undefVars[v] + "'... ");
    try {
        jsQ$('Assert.isUndefined('+undefVars[v]+');',
            {
              exposeExternalVars: 'Assert'
            }
        );
        _print("Ok!\n");
    } catch (e) {
        _print(e + "!\n");
    }
}


/**
 * Test 2 : check exposed external
 */
var defVars = ['Assert', 'scope', 'bar','window'];
for (var v in defVars) {
    _print(new Date().toLocaleTimeString() + " : Testing external exposed '" + defVars[v] + "'... ");
    try {
        jsQ$('Assert.isDefined('+defVars[v]+');',
            {
              exposeExternalVars: defVars
            }
        );
        _print("Ok!\n");
    } catch (e) {
        _print(e + "!\n");
    }
}


/**
 * Test 3 : Closure
 */
_print(new Date().toLocaleTimeString() + " : Testing local scope exclusion... ");
var test3 = 'hello world';
try {
    jsQ$(function() {
        var t = test3;
    });
    _print("Failed! 'test3' should not be available\n");
} catch (e) {
    // Reference error
    _print("Ok!\n");
}


/**
 * Test 4 : default settings
 */
_print(new Date().toLocaleTimeString() + " : Testing default settings... ");
try {
    jsQ$('var a = 1;');
    jsQ$(function() { var a = 1; });
    // TODO : add more tests

    _print("Ok!\n");
} catch (e) {
    _print(e + "!\n");
}


/**
 * Test 5 : anonymous functions
 */
_print(new Date().toLocaleTimeString() + " : Testing anonymous functions... ");
try {
    var a = 0;

    // valid functions
    jsQ$(function() { var a = 1; });
    jsQ$(function a() { var a = 1; });
    jsQ$(function _abc () { var a = 1; });
    jsQ$(function b (    ) { var a = 1; });
    // TODO : more tests ??

    Assert.areSame(0, a);  // make sure we haven't tampered with

    _print("Ok!\n");
} catch (e) {
    _print(e + "!\n");
}

_print(new Date().toLocaleTimeString() + " : Testing invalid functions... ");
// invalid functions
var failed5b = 0;
try { jsQ$(function(a) { var a = 1; });             _print("(a) Failed! ");       failed5b++; } catch (e) { _print("... "); }
try { jsQ$(function a(a,b) { var a = 1; });         _print("(a,b) Failed! ");     failed5b++; } catch (e) { _print("... "); }
try { jsQ$(function _abc (  c    ) { var a = 1; }); _print("(  c    ) Failed! "); failed5b++; } catch (e) { _print("... "); }
_print((failed5b ? "" : "Ok!") + "\n");


/**
 * Test 6 : reusable function
 */
// TODO


/**
 * Test 7 : apply new self to reusable function
 */
// TODO


/**
 * Test 8 : this
 */
_print(new Date().toLocaleTimeString() + " : Testing 'this'... ");
var t6_1 = jsQ$("this.foo = 'bar';");
var t6_2 = jsQ$(function() { this.foo = 'bar'; });

try {
    Assert.areEqual('bar', t6_1.foo);
    Assert.areEqual(t6_1.foo, t6_2.foo);

    _print("Ok!\n");
} catch (e) {
    _print(e + "!\n");
}

// inject a previous 'this' to the sandbox
_print(new Date().toLocaleTimeString() + " : Testing 'this' injection... ");
var t6_3 = jsQ$("this.foo = 'buz';", {self: t6_1});
try {
    Assert.areSame('buz', t6_1.foo);
    Assert.areNotSame(t6_1.foo, t6_2.foo);
    Assert.areSame(t6_3.foo, t6_1.foo);

    _print("Ok!\n");
} catch (e) {
    _print(e + "!\n");
}


/**
 * Test 9 : Async quarantine
 */
// TODO


};
