/**
 * @author Benjamin Oertel (benjamin.oertel@gmail.com)
 * @description
 *      - prioritize your settings: GET parameters > environment settings > default settings 
 *      - match a specific environment with a hostname
 *
 * and it's named after the famous french DDE (public company in charge of the road maintenance)
 * 1 qui travaille, 3 qui regardent
 *
 * @date 01/01/2012
 */

/*jslint browser: true, undef: false, evil: false, plusplus: false, sloppy: true, eqeq: true, white: true, css: false, nomen: false, regexp: true, maxerr: 100, indent: 4 */

(function (window, document, undefined) {
    "dde:nomunge";

    var util, dde;

    util = {
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
        parse: function (message) {
            var data, d, pair, key, value, i;
            data = {};
            d = message.split("&");
            for (i = 0, len = d.length; i < len; i++) {
                pair = d[i].split("=");
                key = pair[0];
                value = pair[1];
                data[key] = unescape(value);
            }
            return data;
        },
        dotToObject: function (name, value) {
            var ns,
                node = {};
                namespaces = name.split("."),
                len = namespaces.length;

            for (var i = 0; i < len; i += 1) {
                var ns = namespaces[i]; 
                var nso = node[ns];
                if (nso === undefined) {
                    nso = (value && i + 1 === len) ? value : {};
                    node[ns] = nso;
                }
                node = nso
            }
            return value;
        }
    };

    dde = {
        version: "0.0.5",
        environment: {},
        _default: {},
        _env: undefined,
        _parameters: undefined,

        _prefix: "dde_",    // prefix of the GET parameters

        /**
         *
         *
         */
        _search: function (search) {
            var namespace, key, value,
                prefixed = {},
                that = this;

            search = util.parse(search);
            for (key in search) {
                value = search[key];
                if (key.search(that._prefix) === 0) {
                    namespace = key.replace(that._prefix, '');
                    prefixed = util.merge(prefixed, util.dotToObject(namespace, value));
                }
            }
            return prefixed;
        },

        _clean: function () {
            this.environment = {};
            this._default = {};
            this._env = undefined;
            this._parameters = undefined;
        },

        default: function (settings) {
            this._default = settings;

            this.environment["*"] = this._default;

            return this;
        },

        /**
         * Create a new environment
         *
         * @param args.host     {string}    host. Use "*" as wildcard
         * @param [args.name]   {string}    name, if not defined, it uses the host as name.
         * @param args.settings {object}    settings for this environment
         */
        push: function (settings, host) {
            if (!host) {
                host = "*";
            }
            
            // Priority: GET parameters > environment settings > default settings
            settings = util.merge(this._default, settings);

            this._parameters = this._search(document.location.hash.replace("#", ""));
            settings = util.merge(settings, this._parameters);

            this.environment[host] = settings;

            return this;
        },

        /**
         * Get the correct environment and put it in dde.env. If there is no environment matching the current host
         * it returns the default one (defined with the wildcard "*")
         *
         * @param callback {function} TODO
         * @return {object} environment
         */
        work: function (callback) {
            var env,
                host = document.location.host;

            if (this.environment[host] !== undefined) {
                env = this.environment[host];
            } else {
                env = this.environment["*"];
            }

            this._env = env;
            return this;
        },

        /**
         * access a setting and return undefined if it's not defined
         *
         * @params name {String}
         * @return {Object} value corresponding to the setting name
         */
        get: function (name) {
            var ns,
                i = 0,
                node = this.env;
                namespaces = name.split("."),
                len = namespaces.length;

            while (i < len && node !== undefined) {
                var ns = namespaces[i];
                node = node[ns];
                i += 1;
            }
            return node;
        },
        set: function (name, value) {
            
        }
    };

    window.dde = dde;

})(window, document);
