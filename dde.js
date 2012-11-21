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

    var util,
        dde,
        defaultHost = "*";

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

        _environment: {},
        _default: {},
        _env: undefined,
        _parameters: undefined,

        _prefix: "dde_",    // prefix of the GET parameters

        _hash: function (search) {
            var namespace, key, value,
                prefixed = {};

            search = util.parse(search);
            for (key in search) {
                value = search[key];
                if (key.search(this._prefix) === 0) {
                    namespace = key.replace(this._prefix, '');
                    value = (value === "true") ? true : (value === "false") ? false : value;
                    prefixed[namespace] = util.dotToObject(namespace, value);
                }
            }
            return prefixed;
        },
        _clean: function () {
            this._environment = {};
            this._default = undefined;
            this._env = undefined;
            this._parameters = undefined;
        },
        _defineEnv: function () {
            var hostname = document.location.hostname,
                env = this._environment[hostname] ? this._environment[hostname] : this._environment[defaultHost];

            this._parameters = this._hash(document.location.hash.replace("#", ""));
            this._env = util.merge(env, this._parameters);

            return this._env;
        },

        byDefault: function () {
            this._isDefault = true;
            return this;
        },
        on: function (domain) {
            this._isOn = domain || defaultHost;
            return this;
        },
        use: function (settings) {
            if (this._isDefault) {
                this._default = util.merge(this._default, settings);
            }

            var domain = this._isOn || defaultHost;
            this._environment[domain] = util.merge(this._default, settings);

            delete this._isDefault;
            delete this._isOn;

            this._defineEnv();
            return this;
        },

        get: function (name) {
            var ns,
                i = 0,
                node = this._defineEnv(),
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
