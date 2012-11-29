describe("Event Library", function () {
    beforeEach(function () {
        dde.init()

        // Check that the clean did its work otherwise tests
        // can be messed up.
        expect(dde._default).toEqual(undefined);
        expect(dde._env).toEqual(undefined);
        //expect(dde._parameters).toEqual(jasmine.any.object());
        
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
                dde.byDefault().use({});
            });

            it("1 environment", function () {
                dde.byDefault().use({});

                dde.use(_simple);

                for (var key in _simple) {
                    expect(dde.get(key)).toEqual(_simple[key]);
                }
            });

            it("default settings are not defined", function () {
                dde.use(_simple);

                for (var key in _simple) {
                    expect(dde.get(key)).toEqual(_simple[key]);
                }
            });
        });

        describe("default settings is a simple object:", function () {
            it("set default settings", function () {
                dde.byDefault().use(_default);

                for (var key in _default) {
                    expect(dde.get(key)).toEqual(_default[key]);
                }
            });

            it("1 environment", function () {
                var key;

                dde.byDefault().use(_default);

                dde.use(_simple);

                for (key in _default) {
                    expect(dde.get(key)).toEqual(_default[key]);
                }

                for (key in _simple) {
                    expect(dde.get(key)).toEqual(_simple[key]);
                }
            });

            it("get the all environment", function () {
                dde.byDefault().use(_default);

                expect(dde.get()).toEqual(_default);
            });

            it("1 environment overwriting 1 default setting", function () {
                dde.byDefault().use(_default);

                dde.use(_overwrite);

                expect(dde.get("a")).not.toEqual(_default["a"]);
                expect(dde.get("a")).toEqual(_overwrite["a"]);
            });
        });

        describe("default settings are a nested object:", function () {
            
            it("1 environment", function () {
                var key;

                dde.byDefault().use(_defaultObject);

                dde.use(_simple);

                for (key in _defaultObject) {
                    expect(dde.get(key)).toEqual(_defaultObject[key]);
                }

                for (key in _simple) {
                    expect(dde.get(key)).toEqual(_simple[key]);
                }
            });

            it("get nested value", function () {
                dde.byDefault().use(_defaultObject);

                expect(dde.get("a.inside")).toEqual(true);
            });

            it("get nested value that don't exist", function () {
                dde.byDefault().use(_defaultObject);

                expect(dde.get("a.outsite")).toEqual(undefined);
            });

            it("1 environment with objects", function () {
                var key;

                dde.byDefault().use(_defaultObject);

                dde.use(_simpleObject);

                for (key in _default) {
                    expect(dde.get(key)).toEqual(_defaultObject[key]);
                }

                for (key in _simpleObject) {
                    expect(dde.get(key)).toEqual(_simpleObject[key]);
                }
            });

            it("1 environment with objects overwriting the default ones", function () {
                var key;

                dde.byDefault().use(_defaultObject);

                dde.use(_overwriteObject);

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

                dde.byDefault().use(_default);

                expect(dde.get("a")).not.toEqual(_default.a);
                expect(dde.get("a")).toEqual("overwritten");
            });

            it("nested value", function () {
                document.location.hash = _hashNested;

                dde.byDefault().use(_default);

                expect(dde.get("a.c")).toEqual("5");

            });
        });

    });

});
