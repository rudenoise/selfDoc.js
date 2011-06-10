// LM.JS List/Array based JavaScript templating/markup by Joel Hughes - http://github.com/rudenoise/LM.JS - http://joelughes.co.uk
// LM.JS by Joel Hughes is licensed under a Creative Commons Attribution 3.0 Unported License
var lm = (function () {
  var lm, q = {}, makeNode, parseArr, parseTag, isTag,
    re = new RegExp("^[a-zA-Z]((?![ ]).)*$"),// match valid tag name
    dFrag = document.createDocumentFragment();// 
  lm = function (arr, pr) {
    // accepts an array (arr) and a parent DOM node (pr, defaults to a doc fragment)
    // returns a DOM tree attached to a document-fragment
    // lm(['p', {class: 'demo'}, 'test', ['em', 'text']]); -> <p class="demo">test <em>text</em></p>
    pr = pr || dFrag.cloneNode(false);
    var i, l, child;
    if (q.isA(arr)) {
      l = arr.length;
      if (isTag(arr)) {
        child = parseTag(arr);
      } else {
        child = parseArr(arr);
      }
      if (q.isDOM(child)) {
        pr.appendChild(child);
      }
      return pr.childNodes.length > 0 ? pr : false;
    }
    return false;
  };
  lm.render = function (tplFun, data) {
    // accepts a tplFun/function and data/object
    // returns the output from the data passed through the tplFun
    return q.isF(tplFun) && q.isO(data) ? tplFun(data) : false;
  };
  // START PRIVATE
  parseArr = function (arr) {
    // loop arr and attach to document fragment, then return document fragment
    var df = dFrag.cloneNode(false), i, l = arr.length;
    for (i = 0; i < l; i += 1) {
      if (isTag(arr[i])) {
        df.appendChild(parseTag(arr[i]));
      }
    }
    return df;
  };
  parseTag = function (arr) {
    // only recieve valid tag arr, create DOM node
    // decorate node with attributes and children, return DOM node
    var tag, i, l = arr.length, part, k;
    for (i = 0; i < l; i += 1) {
      part = arr[i];
      if (i === 0) {// first position must be tag name
        tag = makeNode(part);
      } else {// then decorate with children/attributes
        if (q.isS(part)) {
          tag.appendChild(document.createTextNode(part));
        } else if (isTag(part)) {// a tag
          tag.appendChild(parseTag(part));
        } else if (q.isA(part)) {// an array of tags?
          tag.appendChild(parseArr(part));
        } else if (q.isO(arr[i])) {// loop object and treat as attributes key:val
          for (k in part) {
            if (part.hasOwnProperty(k) && q.isS(part[k])) {
              tag.setAttribute(k, part[k]);
            }
          }
        }
      }
    }
    return tag;
  };
  isTag = function (arr) {
    // validate tag array
    return q.isA(arr) && q.isS(arr[0]) && (arr[0].match(re) !== null);
  };
  makeNode = (function () {
    // return a function taht generates DOM nodes
    // cache stores nodes for cloning
    var cache = {};
    return function (nodeType) {
      // returns a function which either
      // clones a tag from cache or creates a new one
      var node;
      if (cache.hasOwnProperty(nodeType)) {
        node = cache[nodeType].cloneNode(false);
      } else {
        node = document.createElement(nodeType);
        cache[nodeType] = node;
      }
      return node;
    };
  }());
  // following functions taken from Q.JS http://github.com/rudenoise/Q.JS
  q.toS = function (x) {
    // shortcut q.toString
    return Object.prototype.toString.call(x);
  };
  q.isU = function (u) {
    // return true id u q.is undefined
    return typeof u === "undefined";
  };
  q.isF = function (f) {
    // q.is f a function?
    return typeof(f) === "function";
  };
  q.isO = function (o) {
    // q.is "o" an Object?
    return q.isU(o) === false && q.toS(o) === "[object Object]" &&
      typeof o.length !== 'number' && typeof o.splice !== 'function';
  };
  q.isA = function (a) {
    // q.is "a" an Array?
    return q.isU(a) ?
      false :
      typeof a.length  === 'number' &&
      !(a.propertyIsEnumerable('length')) &&
      typeof a.splice  === 'function';
  };
  q.isS = function (s) {
    // q.is s a string?
    return q.isU(s) === false && q.toS(s) === "[object String]";
  };
  q.isDOM = function (node) {
    return q.isU(node) === false && q.isU(node.nodeType) === false;
  };
  // END PRIVATE
  return lm;
}());
