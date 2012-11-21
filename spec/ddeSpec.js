describe("Event Library", function () {
    beforeEach(function () {
        dde._clean()

        // Check that the clean did its work otherwise tests
        // can be messed up.
        expect(dde._default).toEqual(jasmine.any(Object));
        expect(dde._env).toEqual(undefined);
        expect(dde._params).toEqual(undefined);
        
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
        // will be executed
        spyOn(callback, 'one').andCallThrough();
        spyOn(callback, 'two').andCallThrough();
    });

    describe("unique host settings", function () {

        describe("default settings are empty", function () {
            it("set empty default settings", function () {
                dde.work({});
            });

            it("set empty default settings and 1 environment", function () {
                dde.work({});

                dde.push(_simple);

                for (var key in _simple) {
                    expect(dde.get(key)).toEqual(_simple[key]);
                }
            });
        });

        describe("default settings are a simple object", function () {
            it("set default settings", function () {
                dde.work(_default);

                for (var key in _default) {
                    expect(dde.get(key)).toEqual(_default[key]);
                }
            });

            it("1 environment", function () {
                var key;

                dde.work(_default);

                dde.push(_simple);

                for (key in _default) {
                    expect(dde.get(key)).toEqual(_default[key]);
                }

                for (key in _simple) {
                    expect(dde.get(key)).toEqual(_simple[key]);
                }
            });

            it("1 environment overwriting 1 default setting", function () {
                dde.work(_default);

                dde.push(_overwrite);

                expect(dde.get("a")).not.toEqual(_default["a"]);
                expect(dde.get("a")).toEqual(_overwrite["a"]);
            });
        });

        describe("default settings are a nested object", function () {
            
            it("1 environment", function () {
                var key;

                dde.work(_defaultObject);

                dde.push(_simple);

                for (key in _default) {
                    expect(dde.get(key)).toEqual(_default[key]);
                }

                for (key in _simple) {
                    expect(dde.get(key)).toEqual(_simple[key]);
                }
            });

            it("get nested value", function () {
                dde.work(_defaultObject);

                expect(dde.get("a.inside")).toEqual(true);
            });

            it("get nested value that don't exist", function () {
                dde.work(_defaultObject);

                expect(dde.get("a.outsite")).toEqual(undefined);
            });

            it("1 environment with objects", function () {
                var key;

                dde.work(_defaultObject);

                dde.push(_simpleObject);

                for (key in _default) {
                    expect(dde.get(key)).toEqual(_default[key]);
                }

                for (key in _simple) {
                    expect(dde.get(key)).toEqual(_simple[key]);
                }
            });

            it("1 environment with objects overwriting the default ones", function () {
                var key;

                dde.work(_defaultObject);

                dde.push(_overwriteObject);

                expect(dde.get("a")).not.toEqual(_defaultObject.a);
                for (key in _simple) {
                    expect(dde.get(key)).toEqual(_simple[key]);
                }
            });
        });

        describe("hash settings", function () {
            beforeEach(function () {
                _hash = "#dde_c=3&dde_d=4";
                _hashOverwrite = "#dde_a=overwritten&dde_c=4";
            });

            it("basic", function () {
                document.location.hash = _hash;

                dde.work();

                expect(dde.get("c")).toEqual(3);
            });

            it("overwrite settings", function () {
                document.location.hash = _hashOverwrite;

                dde.work(_default);

                expect(dde.get("a")).not.toEqual(_default.a);
                expect(dde.get("a")).toEqual("overwritten");
            });
        });

    });

});
