/*
 * JavaScript Quarantine
 *
 * Authors:
 *  Yanick Rochon (yanick.rochon[at]gmail[dot]com)
 *
 * Licensed under the MIT (MIT-LICENSE.txt) license.
 *
 */

;(function(window, undefined) {

/**
 * Execute the given JavaScript function (or string) in a quarantine zone
 *
 * @param string|function script     the JavaScript to execute
 * @param object          options    (optional) define optional settings
 *                                      - object       global              a global object available in quarantine through a 'global' variable (default = {})
 *                                      - string|array exposeExternalVars  an array or a comma separated list of existing global variables that
 *                                                                         should still be available inside the quarantine (default = [])
 *                                      - object       self                a default quarantine 'this' object (default = {})
 * @param function        callback   (optional) a callback function to execute. This function will receive the quarantined 'this' object
 *                                   as first argument (default = undefined)
 *
 * @return object                    returns the quarantined 'this' script object (undefined if async)
 */
var jsQ$ = function(script, options, callback) {
    if (typeof options === "function") {
        callback = options;
        optoins = undefined;
    }
    if (typeof callback === "function") {
        jsQ$.async(script, options, callback);
    } else {
        return jsQ$.func(script, options)();
    }
};


/**
 * Execute asynchronously the given JavaScript function (or string) in a quarantine zone
 *
 * @param string|function script     the JavaScript to execute
 * @param object          options    (optional) define optional settings
 *                                      - object       global              a global object available in quarantine through a 'global' variable (default = {})
 *                                      - string|array exposeExternalVars  an array or a comma separated list of existing global variable names that
 *                                                                         should still be available inside the quarantine, example : 'window,document' or
 *                                                                         ['window','document'] (default = [])
 *                                      - object       self                a default quarantine 'this' object (default = {})
 * @param function        callback   (optional) a callback function to execute. This function will receive the quarantined 'this' object
 *                                   as first argument (default = undefined)
 */
jsQ$.async = function(script, options, callback) {
    "use strict";
    if (typeof options === "function") {
        callback = options;
        optoins = undefined;
    }
    setTimeout(function() {
        var self = jsQ$.func(script, options);
        if (callback && typeof callback == "function") {
            callback(self);
        }
    }, 1);
};


/**
 * Return a quarantine callable function of the given Javascript function (or script)
 *
 * @param string|function script     the JavaScript to execute
 * @param object          options    define optional settings
 *                                      - object       global              a global object available in quarantine through a 'global' variable (default = {})
 *                                      - string|array exposeExternalVars  an array or a comma separated list of existing global variable names that
 *                                                                         should still be available inside the quarantine, example : 'window,document' or
 *                                                                         ['window','document'] (default = [])
 *                                      - object       self                a default quarantine 'this' object (default = {})
 */
jsQ$.func = (function(){

    // collect all variable names from the `window` object and return as an array
    var collectWindowVars = function() {
        var winVarHide = [];
        for (var i in window) {
            winVarHide.push(i);
        }
        return winVarHide;
    };
    // remove `all` items from `arr`. Return `arr`.
    var removeAll = function(arr, all) {
        var what, L = all.length, ax;
        while (L >= 1 && arr.length) {
            what = all[--L];
            while ((ax = arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    };
    // remove duplicate items from `arr`
    var varOptimize = function(arr) {
        var i, len,
            out=[],
            obj={};

        for (i=0, len=arr.length; i<len; i++) {
            obj[arr[i]]=0;
        }
        for (i in obj) {
            out.push(i);
        }
        return out;
    };
    // return a string representation of the given function. An error will be thrown if the function
    // signature accepts any argument (ie: should be something like 'function() { ... }')
    var fnStringify = function(fn) {
        var fnStr = fn.toString();
        if (fnStr.substring(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).replace(RegExp('\\s*', 'g'), '').length != 0) {
            throw "Function should not have arguments";
        }
        return fnStr.substring(fnStr.indexOf("{") + 1, fnStr.lastIndexOf("}"));
    };

    var globalVars = 'window,collectWindowVars,removeAll,varOptimize,fnStringify,globalVars,exposeExternalVars,options'.split(',');


    return function(script, options) {

        if (typeof script == 'function') {
            script = fnStringify(script);
        }
        if (!script || !script.length) {
            throw "Invalid script body";
        }

        options = options || {};
        var global             = options.global || {};
        var exposeExternalVars = options.exposeExternalVars || [];
        var self               = options.self || {};

        if (typeof exposeExternalVars == 'string') {
            exposeExternalVars = exposeExternalVars.split(RegExp('\\s*,\\s*'));
        }
        exposeExternalVars.push('self');  // do not clear self

        return function() {

            eval('var ' + removeAll(varOptimize(globalVars.concat(collectWindowVars())), exposeExternalVars).join('=undefined,') + '=undefined;');

            (function() { eval(script); }).apply(self);

            return self;
        };
    };
})();


// expose JavaScript Quarantine to the outside world
window.jsQ$ = jsQ$;

})(window);
