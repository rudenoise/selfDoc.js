// selfDoc.js (https://github.com/rudenoise/selfDoc.js) by Joel Hughes (joelhughes.co.uk) is licensed under a Creative Commons Attribution 3.0 Unported License
var selfDoc = (function (maxDepth) {
    maxDepth = maxDepth || 10;
    var doc, extract, loopProps, matchComment, replaceComment, splitLine, clean, getTS, matchTS, decorateTS;
    doc = function (appName, root, overview, lifeSpan, now) {
        // Accepts appName/string, root/function/object, overview
        // Returns an objects containing all nested properties, with documentation
        var rtn, ts;
        now = now || new Date().getTime();
        if (typeof appName    === "string" &&
                (typeof root    === "function" || typeof root === "object")) {
            rtn = {
                appName: appName,
                overview: overview,
                comment: doc.parse(root),
                properties: loopProps(root, lifeSpan, now)
            };
            if (typeof lifeSpan === 'number') {
                rtn = decorateTS(rtn ,root, lifeSpan, now);
            }
            return rtn;
        }
        return false;
    };
    doc.parse = function (fun) {
        // doc.parse accepts fun/function/string as its argument
        // returns an array of strings
        // strings are extracted from uninterupted comment blocks at the top of the function (as illustrated here)
        fun = typeof fun    === "string" ? fun : (fun + "");
        // pass in all but first line
        fun = fun.split(splitLine).slice(1);
        return extract(fun, [], true);
    };
    // PRIVATE
    matchComment = new RegExp("^ *\/\/.*$|^ *\/\\*.*$|^ *\\* .*$");
    replaceComment = new RegExp("^ *\/\/ |^ *\\* |^ *\/\\* |^ *\/\\*\\*");
    matchTS = new RegExp('[0-9]{13}');
    splitLine = new RegExp("\r\n|\n");
    clean = new RegExp("\n *//.*|\r\n *//.*", "g");
    loopProps = function (prop, depth, lifeSpan, now) {
        depth = depth || 1;
        var k, arr = [], funObj;
        for (k in prop) {
            if (prop.hasOwnProperty(k)) {
                funObj = {
                    name: k,
                    type: typeof prop[k],
                    implementation: (prop[k] + "").replace(clean, ""),
                    comment: doc.parse(prop[k]),
                    properties:
                        typeof prop[k] === 'string' ? [] :
                            depth > maxDepth ?
                            ["..."] : loopProps(prop[k], (depth + 1))
                };
                if (typeof lifeSpan === 'number' && typeof prop[k] === 'function') {
                    funObj = decorateTS(funObj , prop[k], lifeSpan, now);
                }
                arr.push(funObj);
            }
        }
        return arr;
    };
    extract = function (lines, comments, uninterupted) {
        return lines.length === 0 || uninterupted === false ?
            comments :
            lines.slice(0, 1)[0].match(matchComment) === null ?
            // no match, recurse
            extract(lines.slice(1), comments, false) :
            // match, collect and recurse
            extract(lines.slice(1), comments.
                concat(lines.slice(0, 1)[0].
                    replace(replaceComment, "")), true);
    };
    getTS = function (str) {
        var m = (str + '').match(matchTS);
        return m === null ?
            false : m[0];
    };
    decorateTS = function (obj, fun, lifeSpan, now) {
        ts = getTS(doc.parse(fun));
        if (ts !== false) {
            obj.freshness = ts > (((now - lifeSpan)) ) ?
                ts > (now - (lifeSpan / 2)) ?
                    'fresh' : 'stale' :
                'old';
        } else {
            obj.freshness = 'noReview';
        }
        return obj;
    };
    return doc;
}());
