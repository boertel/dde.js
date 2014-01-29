describe("Event Library", function () {
    beforeEach(function () {
        // Check that the clean did its work otherwise tests
        // can be messed up.
        dde.clean();

        _default = {a: 1, b: 2};
        _defaultObject = {a: {inside: true}, b: 2};

        _simple = {c: 3, d: 4};
        _simpleObject = {c: {insideC: "random"}, d: 4};

        _overwrite = {a: "1bis", d: 4};
        _overwriteObject = {a: {inside: false}, d: 4};

        callback = {
            one: function () {
                //console.log("callback.one");
            },
            two: function () {
                //console.log("callback.two");
            },
            three: function () {
                //console.log("callback.three");
            }
        };

        // andCallThrough says that the function
        // will be executed`
        spyOn(callback, 'one').andCallThrough();
        spyOn(callback, 'two').andCallThrough();
    });

    describe("unique host settings:", function () {

        describe("default settings are empty:", function () {
            it("basic", function () {
                dde.on("*").use({});
            });

            it("1 environment", function () {
                dde.on("*").use(_simple);

                for (var key in _simple) {
                    expect(dde.get(key)).toEqual(_simple[key]);
                }
            });

            it("default settings are not defined", function () {
                dde.on("*").use(_simple);

                for (var key in _simple) {
                    expect(dde.get(key)).toEqual(_simple[key]);
                }
            });
        });

        describe("default settings is a simple object:", function () {
            it("set default settings", function () {
                dde.on("*").use(_default);

                for (var key in _default) {
                    expect(dde.get(key)).toEqual(_default[key]);
                }
            });

            it("1 environment", function () {
                var key;

                dde.on("*").use(_default);

                dde.on("127.0.0.1").use(_simple);

                for (key in _default) {
                    expect(dde.get(key)).toEqual(_default[key]);
                }

                for (key in _simple) {
                    expect(dde.get(key)).toEqual(_simple[key]);
                }
            });

            it("get the all environment", function () {
                dde.on("*").use(_default);

                expect(dde.get()).toEqual(_default);
            });

            it("1 environment overwriting 1 default setting", function () {
                dde.on("*").use(_default);

                dde.on("127.0.0.1").use(_overwrite);

                expect(dde.get("a")).not.toEqual(_default["a"]);
                expect(dde.get("a")).toEqual(_overwrite["a"]);
            });
        });

        describe("default settings are a nested object:", function () {

            it("1 environment", function () {
                var key;

                dde.on("*").use(_defaultObject);

                dde.on("127.0.0.1").use(_simple);

                for (key in _defaultObject) {
                    expect(dde.get(key)).toEqual(_defaultObject[key]);
                }

                for (key in _simple) {
                    expect(dde.get(key)).toEqual(_simple[key]);
                }
            });

            it("get nested value", function () {
                dde.on("*").use(_defaultObject);

                expect(dde.get("a.inside")).toEqual(true);
            });

            it("get nested value that don't exist", function () {
                dde.on("*").use(_defaultObject);

                expect(dde.get("a.outsite")).toEqual(undefined);
            });

            it("1 environment with objects", function () {
                var key;

                dde.on("*").use(_defaultObject);

                dde.on("127.0.0.1").use(_simpleObject);

                for (key in _default) {
                    expect(dde.get(key)).toEqual(_defaultObject[key]);
                }

                for (key in _simpleObject) {
                    expect(dde.get(key)).toEqual(_simpleObject[key]);
                }
            });

            it("1 environment with objects overwriting the default ones", function () {
                var key;

                dde.on("*").use(_defaultObject);

                dde.on("127.0.0.1").use(_overwriteObject);

                expect(dde.get("a")).not.toEqual(_defaultObject.a);

                for (key in _overwriteObject) {
                    expect(dde.get(key)).toEqual(_overwriteObject[key]);
                }
            });
        });

        describe("hash settings:", function () {
            beforeEach(function () {
                _hash = "#dde_c=3&dde_d=4";
                _hashOverwrite = "#dde_a=overwritten&dde_c=4";
                _hashNested = "#dde_a.c=5";
            });

            afterEach(function () {
                document.location.hash = "";
            });

            it("basic", function () {
                document.location.hash = _hash;

                expect(dde.get("c")).toEqual("3");
            });

            it("overwrite settings", function () {
                document.location.hash = _hashOverwrite;

                dde.on("*").use(_default);

                expect(dde.get("a")).not.toEqual(_default.a);
                expect(dde.get("a")).toEqual("overwritten");
            });

            it("nested value", function () {
                document.location.hash = _hashNested;

                dde.on("*").use(_default);

                expect(dde.get("a.c")).toEqual("5");

            });
        });

    });

});
