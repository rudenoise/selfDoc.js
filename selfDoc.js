// selfDoc.js (https://github.com/rudenoise/selfDoc.js) by Joel Hughes (joelhughes.co.uk) is licensed under a Creative Commons Attribution 3.0 Unported License
var selfDoc = (function (maxDepth) {
    maxDepth = maxDepth || 10;
    var doc, extract, loopProps, matchComment, replaceComment, splitLine, clean;
    doc = function (appName, root, overview) {
        // Accepts appName/string, root/function/object, overview
        // Returns an objects containing all nested properties, with documentation
        if (typeof appName    === "string" &&
                (typeof root    === "function" || typeof root === "object")) {
            return {
                appName: appName,
                overview: overview,
                comment: doc.parse(root),
                properties: loopProps(root)
            };
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
    return doc;
}());
