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

    var util, dde,
        defaultHost = "*";

    util = {
        merge: function (obj1, obj2) {
            var obj3 = {};
            for (var p in obj1) {
                obj3[p] = obj1[p];
            }

            for (var p in obj2) {
                try {
                    // Property in destination object set; update its value.
                    if (obj2[p].constructor==Object ) {
                        obj3[p] = util.merge(obj3[p], obj2[p]);
                    } else {
                        obj3[p] = obj2[p];
                    }
                } catch(e) {
                    // Property in destination object not set; create it and set its value.
                    obj3[p] = obj2[p];
                }
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
        }
    };

    dde = {
        version: "0.0.5",

        prefix: "dde_",    // prefix of the GET parameters

        _hash: function (search) {
            var namespace, key, value,
                prefixed = {};

            search = util.parse(search);
            for (key in search) {
                value = search[key];
                if (key.search(this.prefix) === 0) {
                    namespace = key.replace(this.prefix, '');
                    value = (value === "true") ? true : (value === "false") ? false : value;
                    this.set(namespace, value);
                }
            }
        },
        _define: function (domain) {
            var env,
                hostname = domain || document.location.hostname;

            if (!this._env[hostname]) {
                env = this._environment[hostname] ? this._environment[hostname] : this._environment[defaultHost];

                this._hash(document.location.hash.replace("#", ""));
                env = util.merge(env, this._parameters);
                env = util.merge(this._default, env);

                this._env[hostname] = env;
            }
            return this._env[hostname];
        },

        init: function () {
            this._default = undefined;
            this._environment = {};
            this._parameters = {};

            this._env = {};
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
            this._environment[domain] = settings;

            delete this._isDefault;
            delete this._isOn;

            return this;
        },
        get: function (name) {
            var ns,
                i = 0,
                node = this._define(this._isOn),
                namespaces = (name !== undefined) ? name.split(".") : [],
                len = namespaces.length;

            delete this._isOn;

            while (i < len && node !== undefined) {
                var ns = namespaces[i];
                node = node[ns];
                i += 1;
            }
            return node;
        },
        set: function (name, value) {
            var ns,
                node = this._parameters,
                namespaces = name.split("."),
                len = namespaces.length;

            for (var i = 0; i < len; i += 1) {
                var ns = namespaces[i]; 
                var nso = node[ns];
                if (nso === undefined) {
                    nso = (value && i + 1 === len) ? value : {};
                    node[ns] = nso;
                }
                node = nso;
            }
            return node;
        }
    };

    dde.init();
    window.dde = dde;

})(window, document);
