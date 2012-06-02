/**
 * @author: Benjamin Oertel (ben@punchtab.com)
 * @description: match a specific host with a specific configuration
 * and it's named after the famous french DDE (public company in charge of the road maintenance)
 * 1 qui travaille, 3 qui regardent
 *
 * @date: 01/01/2012
 */

/*jslint browser: true, undef: false, evil: false, plusplus: false, sloppy: true, eqeq: true, white: true, css: false, nomen: false, regexp: true, maxerr: 100, indent: 4 */

(function (window, undefined) {
    "dde:nomunge";

    var priv, dde;

    priv = {
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
        }
    };

    dde = {
        version: "0.0.2",
        environment: {},
        common: {},

        /**
         * Create a new environment
         *
         * @param args.host     {string}    host. Use "*" as wildcard
         * @param [args.name]   {string}    name, if not defined, it uses the host as name.
         * @param args.settings {object}    settings for this environment
         */
        push: function (args) {
            var search;
            if (args.host === "*") {
                args.host = "default";
            }
            
            // Priority: GET parameters > environment settings > common settings
            args.settings = priv.merge(this.common, args.settings);

            if (document.location.search.length > 0) {
                search = priv.jsonify(document.location.search.replace("?", ""));
                args.settings = priv.merge(args.settings, search);
            }

            this.environment[args.host] = {
                host: args.host,
                name: args.name || args.host,
                settings: args.settings
            };
        },

        /**
         * Get the correct environment and put it in dde.env. If there is no environment matching the current host
         * it returns the default one (defined with the wildcard "*")
         *
         * @param callback {function} TODO
         * @return {object} environment
         */
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
        
        /**
         * log function that logs only with it's safe
         * meaning window.console available
         */
        log: function () {
            window.console && window.console.log(arguments);
        }
    };

    dde._q = window.dde ? window.dde._q : [];
    dde.ready = function (callback) {
        callback(dde);
    };

    while (dde._q.length > 0) {
        dde.ready(dde._q.shift());
    }

    window.dde = dde;

})(window);
