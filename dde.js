/* Author: Benjamin Oertel (ben@punchtab.com)
 * Description: match a specific host with a specific configuration
 * Date: 01/01/2012
 */

var dde = {
    environment: {},

    push: function (args) {
        var default_values = [false, '', 'default', '*'];
        if (default_values.indexOf(args.host) !== -1) {
            args.host = "default";
        }
        
        if (this.commons !== undefined ) {
            args.settings = this.merge(this.commons, args.settings)
        };

        if (document.location.search.length > 0) {
            var search = this.jsonify(document.location.search.replace("?", ""));
            args.settings = this.merge(args.settings, search);
        }

        this.environment[args.host] = {
            host: args.host,
            name: args.name || args.host,
            settings: args.settings
        };
    },
    work: function (callback) {
        var host = document.location.host;
        var env;

        if (this.environment[host] !== undefined) {
            env = this.environment[host];
        } else {
            env = this.environment["default"];
        }

        dde.env = env;
        return env;
    },
    merge: function (obj1, obj2) {
        var obj3 = {};
        for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
        for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
        return obj3;
    },
    jsonify: function (message) {
        var data = {};
        var d = message.split("&");
        var pair, key, value;
        for (var i = 0, len = d.length; i < len; i++) {
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
