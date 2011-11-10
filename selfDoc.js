// selfDoc.js (https://github.com/rudenoise/selfDoc.js) by Joel Hughes (joelhughes.co.uk) is licensed under a Creative Commons Attribution 3.0 Unported License
var selfDoc = (function (maxDepth) {
    maxDepth = maxDepth || 10;
    var doc, extract, loopProps, matchComment, replaceComment, splitLine, clean, getTS, matchTS;
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
                properties: loopProps(root)
            };
            ts = getTS(doc.parse(root));
            if (typeof lifeSpan === 'number') {
                if (ts !== false) {
                    console.log(ts, now);
                    rtn.freshness = ts > (((now - lifeSpan)) ) ?
                        ts > (now - (lifeSpan / 2)) ?
                            'fresh' : 'stale' :
                        'old';
                } else {
                
                }
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
    loopProps = function (prop, depth) {
        depth = depth || 1;
        var k, arr = [];
        for (k in prop) {
            if (prop.hasOwnProperty(k)) {
                arr.push({
                    name: k,
                    type: typeof prop[k],
                    implementation: (prop[k] + "").replace(clean, ""),
                    comment: doc.parse(prop[k]),
                    properties:
                        typeof prop[k] === 'string' ? [] :
                            depth > maxDepth ?
                            ["..."] : loopProps(prop[k], (depth + 1))
                });
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
    return doc;
}());
