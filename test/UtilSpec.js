describe('services.util', function() {

    var service;

    beforeEach(function() {
        module('services');
        inject(function(util) {
            service = util;
        });
    });

    describe("'getQueryString' method", function() {
        it('should convert an object to a query string', function() {
            var params = {foo: 'bar'},
                qs = service.getQueryString(params);

            expect(qs).toEqual('foo=bar');
        });
        it('should accept multiple parameters', function() {
            var params = {key1: 'val1', key2: 'val2'},
                qs = service.getQueryString(params);

            expect(qs).toEqual('key1=val1&key2=val2');
        });
        it('should should escape unsafe characters', function() {
            var params = {name: "Ben & Jerry's"},
                qs = service.getQueryString(params);

            expect(qs).toEqual("name=Ben%20%26%20Jerry's");
        });
    });

    describe("'range' method", function() {
        it('should work in simple use cases', function() {
            var range = service.range(1, 5);
            expect(range).toEqual([1, 2, 3, 4, 5]);
        });
        it('should work with bigger step', function() {
            var range = service.range(0, 10, 2);
            expect(range).toEqual([0, 2, 4, 6, 8, 10]);
        });
    });

    describe("'group' method", function() {
        it('should work as expected', function() {
            var flat = [1, 2, 3, 4, 5, 6, 7, 8, 9],
                grouped = service.group(flat, 3);

            expect(grouped).toEqual([
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ]);
        });
        it('should work when number of elements is not dividable by group size', function() {
            var flat = [1, 2, 3, 4, 5],
                grouped = service.group(flat, 3);

            expect(grouped).toEqual([
                [1, 2, 3],
                [4, 5]
            ]);
        });
    });

});