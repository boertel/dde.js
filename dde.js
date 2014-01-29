/**
 * @author Benjamin Oertel (benjamin.oertel@gmail.com)
 * @description
 *      - prioritize your settings: GET parameters > environment settings > default settings
 *      - match a specific environment with a hostname
 *
 * and it's named after the famous french DDE (public company in charge of the road maintenance)
 * "1 qui travaille, 3 qui regardent"
 *
 * @date 01/01/2012
 */

/*jslint browser: true, undef: false, evil: false, plusplus: false, sloppy: true, eqeq: true, white: true, css: false, nomen: false, regexp: true, maxerr: 100, indent: 4 */

(function (window, document, undefined) {
    var utils = {};
    utils.merge = function (obj1, obj2) {
        var p, obj3 = {};
        for (p in obj1) {
            obj3[p] = obj1[p];
        }

        for (p in obj2) {
            try {
                // Property in destination object set; update its value.
                if (obj2[p].constructor==Object ) {
                    obj3[p] = utils.merge(obj3[p], obj2[p]);
                } else {
                    obj3[p] = obj2[p];
                }
            } catch(e) {
                // Property in destination object not set; create it and set its value.
                obj3[p] = obj2[p];
            }
        }
        return obj3;
    };
    utils.parse = function (message) {
        var data, d, pair, key, value, i, len;
        data = {};
        d = message.split("&");
        for (i = 0, len = d.length; i < len; i += 1) {
            pair = d[i].split("=");
            key = pair[0];
            value = pair[1];
            data[key] = unescape(value);
        }
        return data;
    };
    utils.extract_hash = function (prefix) {
        var search, namespace, key, value,
            prefixed = {};

        search = utils.parse(document.location.hash.replace("#", ""));
        for (key in search) {
            value = search[key];
            if (key.search(prefix) === 0) {
                namespace = key.replace(prefix, '');
                value = (value === "true") ? true : (value === "false") ? false : value;
                utils.dot.set(prefixed, namespace, value);
            }
        }
        return prefixed;
    };

    utils.dot = {};
    utils.dot.get = function (node, name) {
        var ns,
            i = 0,
            namespaces = (name !== undefined) ? name.split(".") : [],
            len = namespaces.length;

        while (i < len && node !== undefined) {
            ns = namespaces[i];
            node = node[ns];
            i += 1;
        }
        return node;
    };
    utils.dot.set = function (node, name, value) {
        var ns,
            namespaces = name.split("."),
            len = namespaces.length;

        for (var i = 0; i < len; i += 1) {
            ns = namespaces[i];
            var nso = node[ns];
            if (nso === undefined) {
                nso = (value !== undefined && i + 1 === len) ? value : {};
                node[ns] = nso;
            }
            node = nso;
        }
        return node;
    };


    function Env(namespace, settings) {
        this.namespace = namespace;
        this.settings = settings;
    }
    Env.prototype.set = function (key, value) {
        return utils.dot.set(this.settings, key, value);
    };
    Env.prototype.get = function (key) {
        return utils.dot.get(this.settings, key);
    };
    Env.prototype.use = function (settings) {
        this.settings = settings;
    };

    var environments = {},
        dde = {};

    dde.on = function (namespace) {
        var env = environments[namespace];
        if (env === undefined) {
            env = new Env(namespace);
            environments[namespace] = env;
        }
        return env;
    };

    dde.work = function (namespace) {
        namespace = namespace || document.location.hostname;
        this.current = environments[namespace];
        return this;
    };

    dde.get = function (key) {
        // priority: ? > env > *
        dde.work();

        var value = this.on("?").get(key);
        if (value === undefined && this.current) {
            value = this.current.get(key);
        }
        if (value === undefined) {
            value = this.on("*").get(key);
        }
        return value;
    };

    dde.clean = function () {
        environments = {};
        this.current = undefined;
    };


    dde.version = "0.0.6";
    dde.prefix = "dde_";

    dde.on("?").use(utils.extract_hash(dde.prefix));

    window.dde = dde;
})(window, document);
