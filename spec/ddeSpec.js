describe("Event Library", function () {
    beforeEach(function () {
        dde._clean()

        // Check that the clean did its work otherwise tests
        // can be messed up.
        expect(dde._default).toEqual(jasmine.any(Object));
        expect(dde._env).toEqual(undefined);
        expect(dde._params).toEqual(undefined);
        
        _settings = {a: 1, b: 2};
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


    it("set default settings", function () {
        dde.default(_settings);

        for (var key in _settings) {
            expect(dde.get(key)).toEqual(_settings[key]);
        }
    });
});
