(function () {
  var cont = document.getElementById("container"),
    render, comments, children, doc;
  cont.innerHTML = "";
  comments = function (cs) {
    var i, l = cs.length, rtn = [];
    for (i = 0; i < l; i += 1) {
      rtn.push(['p', cs[i]]);
    }
    return rtn;
  };
  children = function (ps, prnt) {
    var i, l = ps.length, rtn = [];
    for (i = 0; i < l; i += 1) {
      rtn.push(['li', render(ps[i], prnt)]);
    }
    return rtn;
  };
  render = function (obj, prnt) {
    prnt = (obj.appName || (prnt + "." + obj.name));
    return [
      [(obj.appName ? 'h1' : 'h2'), prnt],
      (obj.overview ? (['h3', obj.overview]) : []),
      ['div', {'class': "comments"}, comments(obj.comment)],
      ['pre', {'class': 'code'}, obj.implementation],
      ['p', obj.overview],
      ['ul', {'class': 'children'}, children(obj.properties, prnt)]];
  };
  cont.appendChild(lm(render(selfDoc("selfDoc", selfDoc, 'selfDoc create dynamic documentation that mirrors your JavaScript code by reading itself!'))));
  cont.appendChild(lm(render(selfDoc('lm', lm, 'Less Markup: write HTML using JavaScript Arrays'))));
  cont.appendChild(lm(render(selfDoc('q', q, "Q.JS https://github.com/rudenoise/Q.JS is a x-browser collection of utilities for queues and questions."))));
}());
