module("selfDoc.js", {
  setup: function () {
    this.t1 = function () {
      // single line comment
      return true;
    };
    this.t2 = function () {
      // first line
      // second line
      return true
    };
    this.t2.t3 = function () {
      // first line
      var t = true;
      // second line
      return t;
    };
    this.t2.t3.arr = [];
    this.t2.t3.obj = {
      a: "b"
    };
    this.t2.t3.str = "str";
    this.t4 = function () {
      /**
       * mulit line comment
       * yes
       */
      return true;
    };
  },
  teardown: function () {}
});
test("Root function", function () {
  ok(typeof(selfDoc) === "function", "selfDoc is a function");
  ok((selfDoc() &&
    selfDoc(123) &&
    selfDoc(true, 123)) === false, "rejects no/bad args");
  ok(typeof(selfDoc("test", {a: 1})) === "object", "string and obj returns object");
  ok(selfDoc("test", {a: 1}).appName === "test", "app name is set to 1st str arg");
  ok(selfDoc("test", {a: 1}).hasOwnProperty("properties"), "app has properties");
  ok(selfDoc("test", {a: 1}).properties[0].name === "a", "obtains correct name");
  ok(selfDoc("test", {
    a: {
      b: 1
    }
  }).properties[0].properties[0].name === "b", "obtains correct name");
  ok(selfDoc("t2", this.t2).properties[0].type === "function", "recogniese types");
  ok(selfDoc("t2", this.t2).properties[0].implementation ===
    (this.t2.t3 + "").replace(new RegExp("\n *//.*|\r\n *//.*", "g"), ""),
    "converts function to string");
  ok(selfDoc('t2', this.t2).properties[0].properties[2].properties.length === 0,
      "doesn't loop strings for properties");
});
test("Parse function", function () {
  ok(typeof(selfDoc.parse) === "function", "selfDoc.parse is a function");
  ok(typeof(selfDoc.parse()) === "object" &&
    selfDoc.parse().length === 0, "selfDoc.parse returns empty arr by default");
  ok(selfDoc.parse("asdas\r\n  // test")[0] === "test", "extracts comment from second line");
  ok(selfDoc.parse(this.t1)[0] === "single line comment",
    "collects correct 1 line comment");
  ok(selfDoc.parse(this.t2)[1] === "second line",
    "collects correct 2 line comment");
  ok(selfDoc.parse(this.t2.t3).length === 1,
    "ignores comments after first block");
  // TODO: adjust blank lines?
  ok(selfDoc.parse(this.t4).length === 3, "works for multi line comment blocks");
});
