// Q.JS List/Array based templating by Joel Hughes - http://github.com/rudenoise/Q.JS - http://joelughes.co.uk
// Q.JS by Joel Hughes is licensed under a Creative Commons Attribution 3.0 Unported License
var q = (function (q) {
  q.toS = function (x) {
    // shortcut q.toString
    return Object.prototype.toString.call(x);
  };
  q.toA = function (o) {
    // convert q.to an array, object needs indexes and length
    return Array.prototype.slice.call(o);
  };
  q.isU = function (u) {
    // return true id u q.is undefined
    return typeof(u) === "undefined";
  };
  q.isF = function (f) {
    // q.is f a function?
    return typeof(f) === "function";
  };
  q.isO = function (o) {
    // q.is "o" an Object?
    return q.isU(o) === false && q.toS(o) === "[object Object]" &&
      typeof(o.length) !== 'number' && typeof(o.splice) !== 'function';
  };
  q.isA = function (a) {
    // q.is "a" an Array?
    return q.isU(a) ?
      false :
      typeof(a.length) === 'number' &&
      !(a.propertyIsEnumerable('length')) &&
      typeof(a.splice) === 'function';

  };
  q.isS = function (s) {
    // q.is s a string?
    return q.isU(s) === false && q.toS(s) === "[object String]";
  };
  q.isN = function (n) {
    // q.is n a number and not NaN?
    return q.toS(n) === "[object Number]" && !isNaN(n);
  };
  q.isB = function (b) {
    // q.is b a boolean, but not a new Boolean(true)
    return typeof(b) === "boolean";
  };
  q.isEA = function (a) {
    // q.is a an empty list?
    return q.isA(a) && a.length === 0;
  };
  q.isEq = function (a, b) {
    // q.is a the exact same as b?
    return a === b;
  };
  q.isES = function (s) {
    // q.is s an empty string?
    return s === "";
  };
  q.isDOM = function (node) {
    return q.isU(node) === false && q.isU(node.nodeType) === false;
  };
  q.h = function (a) {
    // return the head of a list
    if (q.isA(a)) {
      return a[0];
    }
  };
  q.t = function (a) {
    // return the tail of a list
    if (q.isA(a)) {
      return a.slice(1, a.length);
    }
  };
  q.cons = function (inPut, list) {
    // push inPut onto the front of a list
    if (!q.isU(inPut) && q.isA(list)) {
      return [inPut].concat(list);
    }
  };
  q.areEq = function () {
    // are all arguments the same value?
    var args = q.toA(arguments);
    return q.isEA(args) ?
      true :
      args.length === 1 ?
        true :
        q.isEq(q.h(args), q.h(q.t(args))) ?
          q.areEq.call(q.t(args)) :
          false;
  };
  q.inA = function (val, arr) {
    // q.is the value in arr (top level)
    return !q.isA(arr) || q.isU(val) || q.isEA(arr) ?
      false:
      val === q.h(arr) ?
        true : q.inA(val, q.t(arr));
  };
  q.flat = function (a, f) {
    // flatten an array [1, [2], 3] -> [1, 2, 3] use with inA
    f = q.isA(f) ? f : []; // f used q.to store return value
    return !q.isA(a) ?
      false :
      q.isEA(a) ?
        f :
        q.isA(q.h(a)) ?
          q.flat(q.h(a)).concat(q.flat(q.t(a), f)) :
          q.cons(q.h(a), q.flat(q.t(a), f));
  };
  q.objHas = function (obj, chain) {
    // feed me an object and a string representation of properties
    // I'll return boolean if correct q.objHas({a: {b: 1}}, "a.b") -> true
    if (q.isS(chain) && chain[0] !== ".") {
      chain = chain.split(".");
      return q.isES(q.h(chain)) ? true :
        (obj.hasOwnProperty(q.h(chain))) ?
          q.objHas(obj[q.h(chain)], q.t(chain).join(".")) :
          false;
    }
  };
  return q;
}(q || {}));
