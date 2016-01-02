var S = require('string');

//S.extendPrototype();

var Utility = function () { };
Utility.StringUtility = {
    toPermissionName : function (name) {
        return S(S(name).slugify().s).replaceAll("-", "_").s.toUpperCase()
    },
    d2h: function (d) {
        return d.toString(16);
    },
    h2d: function (h) {
        return parseInt(h, 16);
    }
};

module.exports = Utility;
