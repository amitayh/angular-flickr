describe('services.flickr', function () {

    var gateway = 'http://api.flickr.com/services/rest/',
        httpBackend, service, flickr;

    beforeEach(function() {
        module('services');
        inject(function($httpBackend, FlickrAPI) {
            httpBackend = $httpBackend;
            service = FlickrAPI;
            flickr = new FlickrAPI('fake');
        });
    });

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should reject promise on invalid response', function() {
        var message = 'Something went wrong',
            data = {message: message},
            success = jasmine.createSpy(),
            error = jasmine.createSpy();

        httpBackend.expectJSONP(/api\.flickr\.com/).respond(data);
        flickr.getSets('1234').then(success, error);
        httpBackend.flush();

        expect(success).not.toHaveBeenCalled();
        expect(error).toHaveBeenCalledWith(message);
    });

    describe("'getSets' method", function() {
        it('should fetch sets for user ID', function() {
            var photosets = ['photoset1', 'photoset2'],
                url = gateway + '?method=flickr.photosets.getList&user_id=1234&api_key=fake&format=json&jsoncallback=JSON_CALLBACK',
                data = {stat: 'ok', photosets: photosets},
                callback = jasmine.createSpy();

            httpBackend.expectJSONP(url).respond(data);
            flickr.getSets('1234').then(callback);
            httpBackend.flush();
            expect(callback).toHaveBeenCalledWith(photosets);
        });
        it('should fetch sets page', function() {
            var url = gateway + '?method=flickr.photosets.getList&user_id=1234&per_page=10&page=5&api_key=fake&format=json&jsoncallback=JSON_CALLBACK',
                data = {stat: 'ok'};

            httpBackend.expectJSONP(url).respond(data);
            flickr.getSets('1234', 10, 5);
            httpBackend.flush();
        });
    });

    describe("'getSetInfo' method", function() {
        it('should fetch set info', function() {
            var photoset = {id: 1234, name: 'foo'},
                url = gateway + '?method=flickr.photosets.getInfo&photoset_id=1234&api_key=fake&format=json&jsoncallback=JSON_CALLBACK',
                data = {stat: 'ok', photoset: photoset},
                callback = jasmine.createSpy();

            httpBackend.expectJSONP(url).respond(data);
            flickr.getSetInfo('1234').then(callback);
            httpBackend.flush();

            expect(callback).toHaveBeenCalledWith(photoset);
        });
    });

    describe("'getPhotos' method", function() {
        it('should fetch photos in photo set', function() {
            var photoset = {id: 1234, name: 'foo'},
                url = gateway + '?method=flickr.photosets.getPhotos&photoset_id=1234&api_key=fake&format=json&jsoncallback=JSON_CALLBACK',
                data = {stat: 'ok', photoset: photoset},
                callback = jasmine.createSpy();

            httpBackend.expectJSONP(url).respond(data);
            flickr.getPhotos('1234').then(callback);
            httpBackend.flush();

            expect(callback).toHaveBeenCalledWith(photoset);
        });
        it('should fetch photos page in photo set', function() {
            var url = gateway + '?method=flickr.photosets.getPhotos&photoset_id=1234&per_page=10&page=5&api_key=fake&format=json&jsoncallback=JSON_CALLBACK',
                data = {stat: 'ok'};

            httpBackend.expectJSONP(url).respond(data);
            flickr.getPhotos('1234', 10, 5);
            httpBackend.flush();
        });
    });

    describe("'getPhotoUrl' method", function() {
        it('should return a valid Flickr photo URL', function() {
            var photo = {farm: '1', server: 2, id: 3, secret: 4},
                expected = 'http://farm1.static.flickr.com/2/3_4_s.jpg';

            expect(service.getPhotoUrl(photo, service.Size.Square)).toEqual(expected);
        });
    });

});