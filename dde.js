/* Author: Benjamin Oertel (ben@punchtab.com)
 * Description: match a specific host with a specific configuration
 * Date: 01/01/2012
 */

/*jslint browser: true, undef: false, evil: false, plusplus: false, sloppy: true, eqeq: true, white: true, css: false, nomen: false, regexp: true, maxerr: 100, indent: 4 */

var dde = {
    environment: {},

    push: function (args) {
        var search;
        if (args.host === "*") {
            args.host = "default";
        }
        
        if (this.commons !== undefined)  {
            args.settings = this.merge(this.commons, args.settings);
        }

        if (document.location.search.length > 0) {
            search = this.jsonify(document.location.search.replace("?", ""));
            args.settings = this.merge(args.settings, search);
        }

        this.environment[args.host] = {
            host: args.host,
            name: args.name || args.host,
            settings: args.settings
        };
    },
    work: function (callback) {
        var host, env;
        host = document.location.host;

        if (this.environment[host] !== undefined) {
            env = this.environment[host];
        } else {
            env = this.environment["default"];
        }

        dde.env = env;
        return env;
    },
    merge: function (obj1, obj2) {
        var obj3, attrname;
        obj3 = {};
        for (attrname in obj1) {
            obj3[attrname] = obj1[attrname];
        }
        for (attrname in obj2) {
            obj3[attrname] = obj2[attrname];
        }
        return obj3;
    },
    jsonify: function (message) {
        var data, d, pair, key, value, i;
        data = {};
        d = message.split("&");
        for (i = 0, len = d.length; i < len; i++) {
            pair = d[i];
            key = pair.substring(0, pair.indexOf("="));
            value = pair.substring(key.length + 1);
            data[key] = unescape(value);
        }
        return data;
    },
    log: function (args) {
        if (window.console) {
            window.console.log(args);
        }
    }
};
window.ddeAsyncInit && window.ddeAsyncInit();

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";
        if (this === null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 0) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n !== 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    };
}
