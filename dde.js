/* Author: Benjamin Oertel (ben@punchtab.com)
 * Description: match a specific host with a specific configuration
 * Date: 01/01/2012
 */

/*
 * TODO:
 *  - async
 *  - auto run
 */

var dde = {
    environments: {},
    current: {},

    push: function (domain, name, settings) {
        var default_values = [false, '', 'default', '*'];
        if (default_values.indexOf(domain) !== -1) {
            domain = 'default';
        }
        this.environments[domain] = {domain: domain, name: name, settings: settings};
    },
    defaultRunCallback: function (data, callback) {
        // use dde because we are in a callback function
        dde.current = data;
        callback && callback(data);
    },
    run: function (callback, current) {
        if (!callback) {
            callback = this.defaultRunCallback;
        }
        // by default, run the default callback
        if (current !== false) {
            oldCallback = callback;
            callback = function (data) { dde.defaultRunCallback(data, oldCallback); };
        }
        var host = document.location.host;
        if (this.environments[host] !== undefined) {
            callback(this.environments[host]);
        } else {
            callback(this.environments['default']);
        }
    },
    log: function (args) {
        if (window.console) {
            window.console.log(args);
        }
    }
};
/*
DDE.push('127.0.0.1', 'dev', {
    web: 'http://127.0.0.1',
    facebook_app_id: '219311311484213',
    publishing: true,
    logging: true
});
// default environment
DDE.push('*', 'prod', {
    web: 'http://medaille-boertel.dotcloud.com',
    facebook_app_id: '238768499521270',
    publishing: true,
    logging: false
});

DDE.run();
*/
