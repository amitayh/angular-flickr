angular.module('services').factory('FlickrAPI', function($http, util) {

    var GATEWAY = 'http://api.flickr.com/services/rest/';

    function FlickrAPI(apiKey) {
        this.apiKey = apiKey;
    }

    FlickrAPI.prototype.getUrl = function(params) {
        params.api_key = this.apiKey;
        params.format = 'json';
        params.jsoncallback = 'JSON_CALLBACK';

        return GATEWAY + '?' + util.getQueryString(params);
    };

    FlickrAPI.prototype.getData = function(params, property) {
        var url = this.getUrl(params);
        return $http.jsonp(url).then(function(response) {
            var data = response.data;
            if (!data || data.stat !== 'ok') {
                throw new Error(data.message || 'Error');
            }
            return property ? data[property] : data;
        });
    };

    // Public methods

    FlickrAPI.prototype.getSets = function(userId, perPage, page) {
        var params = {
            method: 'flickr.photosets.getList',
            user_id: userId
        };
        if (perPage !== undefined) {
            params.per_page = perPage;
        }
        if (page !== undefined) {
            params.page = page;
        }
        return this.getData(params, 'photosets');
    };

    FlickrAPI.prototype.getSetInfo = function(setId) {
        return this.getData({
            method: 'flickr.photosets.getInfo',
            photoset_id: setId
        }, 'photoset');
    };

    FlickrAPI.prototype.getPhotos = function(setId, perPage, page) {
        var params = {
            method: 'flickr.photosets.getPhotos',
            photoset_id: setId
        };
        if (perPage !== undefined) {
            params.per_page = perPage;
        }
        if (page !== undefined) {
            params.page = page;
        }
        return this.getData(params, 'photoset');
    };

    FlickrAPI.Size = {
        Square:         '_s',
        LargeSquare:    '_q',
        Thumbnail:      '_t',
        Small:          '_m',
        Small320:       '_n',
        Medium:         '',
        Medium640:      '_z',
        Medium800:      '_c',
        Large:          '_b',
        Original:       '_o'
    };

    FlickrAPI.getPhotoUrl = function(photo, size) {
        return 'http://farm' + photo.farm + '.static.flickr.com/' +
            photo.server + '/' + photo.id + '_' + photo.secret + size + '.jpg';
    };

    return FlickrAPI;
});