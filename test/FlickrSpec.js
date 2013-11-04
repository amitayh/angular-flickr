describe('services.flickr', function () {

    var gateway = 'http://api.flickr.com/services/rest/',
        mock, service, flickr;

    beforeEach(function() {
        var spy = jasmine.createSpy().andReturn({then: function() {}});
        mock = {jsonp: spy};

        module(function($provide) {
            $provide.value('$http', mock);
        });

        module('services');

        inject(function(FlickrAPI) {
            service = FlickrAPI;
            flickr = new FlickrAPI('fake');
        });
    });

    describe("'getSets' method", function() {
        it('should fetch sets for user ID', function() {
            var expected = '?method=flickr.photosets.getList&user_id=1234&api_key=fake&format=json&jsoncallback=JSON_CALLBACK';
            flickr.getSets('1234');
            expect(mock.jsonp).toHaveBeenCalledWith(gateway + expected);
        });
        it('should fetch sets page', function() {
            var expected = '?method=flickr.photosets.getList&user_id=1234&per_page=10&page=5&api_key=fake&format=json&jsoncallback=JSON_CALLBACK';
            flickr.getSets('1234', 10, 5);
            expect(mock.jsonp).toHaveBeenCalledWith(gateway + expected);
        });
    });

    describe("'getSetInfo' method", function() {
        it('should fetch set info', function() {
            var expected = '?method=flickr.photosets.getInfo&photoset_id=1234&api_key=fake&format=json&jsoncallback=JSON_CALLBACK';
            flickr.getSetInfo('1234');
            expect(mock.jsonp).toHaveBeenCalledWith(gateway + expected);
        });
    });

    describe("'getPhotos' method", function() {
        it('should fetch photos in photo set', function() {
            var expected = '?method=flickr.photosets.getPhotos&photoset_id=1234&api_key=fake&format=json&jsoncallback=JSON_CALLBACK';
            flickr.getPhotos('1234');
            expect(mock.jsonp).toHaveBeenCalledWith(gateway + expected);
        });
        it('should fetch photos page in photo set', function() {
            var expected = '?method=flickr.photosets.getPhotos&photoset_id=1234&per_page=10&page=5&api_key=fake&format=json&jsoncallback=JSON_CALLBACK';
            flickr.getPhotos('1234', 10, 5);
            expect(mock.jsonp).toHaveBeenCalledWith(gateway + expected);
        });
    });

    describe("'getPhotoUrl' method", function() {
        it('should return a valid Flickr photo URL', function() {
            var photo = {farm: '1', server: 2, id: 3, secret: 4},
                expected = 'http://farm1.static.flickr.com/2/3_4_s.jpg';
            expect(service.getPhotoUrl(photo, service.Size.Square)).toBe(expected);
        });
    });

});