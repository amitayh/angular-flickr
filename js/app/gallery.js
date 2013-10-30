angular.module('gallery', ['services', 'ngSanitize'])

    // Config
    .config(function($routeProvider) {
        $routeProvider.when('/gallery', {
            templateUrl: 'templates/gallery/index.html',
            controller: 'IndexCtrl'
        });
        $routeProvider.when('/gallery/:id', {
            templateUrl: 'templates/gallery/gallery.html',
            controller: 'GalleryCtrl'
        });
        $routeProvider.when('/gallery/:gallery/photo/:id', {
            templateUrl: 'templates/gallery/photo.html',
            controller: 'PhotoCtrl'
        });
        $routeProvider.when('/gallery/:id/:page', {
            templateUrl: 'templates/gallery/gallery.html',
            controller: 'GalleryCtrl'
        });
    })
    .constant('LOADING_IMAGE', '/images/ajax-loader.gif')
    .constant('FLICKR_API_KEY', '<YOUR API KEY>')
    .constant('FLICKR_USER_ID', '<YOUR USER ID>')

    // Services
    .factory('flickr', function(FlickrAPI, FLICKR_API_KEY) {
        return new FlickrAPI(FLICKR_API_KEY);
    })

    // Controllers
    .controller('IndexCtrl', function($scope, flickr, FLICKR_USER_ID) {
        $scope.galleries = null;
        flickr.getSets(FLICKR_USER_ID).then(function(result) {
            $scope.galleries = result.photoset;
        });
    })
    .controller('GalleryCtrl', function($scope, $routeParams, flickr, util, Pagination) {
        var setId = $routeParams.id,
            page = parseInt($routeParams.page || 1),
            rows = 3, columns = 3, perPage = rows * columns;

        $scope.gallery = flickr.getSetInfo(setId);
        $scope.pagination = new Pagination(page, perPage);
        $scope.photos = null;
        flickr.getPhotos(setId, perPage, page).then(function(result) {
            $scope.pagination.pages = result.pages;
            $scope.photos = util.group(result.photo, columns);
        });
    })
    .controller('PhotoCtrl', function($scope, $routeParams, flickr) {
        var photoId = $routeParams.id;
        $scope.photo = flickr.getPhotoInfo(photoId);
    })

    // Directives
    .directive('spinner', function(LOADING_IMAGE) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                function changeSrc(src) {
                    elem[0].src = src;
                }
                attrs.$observe('src', function(src) {
                    changeSrc(LOADING_IMAGE);
                    var img = new Image();
                    img.onload = function() { changeSrc(src); };
                    img.src = src;
                });
            }
        };
    })

    // Filters
    .filter('content', function() {
        return function(value) {
            return value ? value._content : '';
        };
    })
    .filter('thumbnail', function(FlickrAPI) {
        return function(gallery) {
            return FlickrAPI.getPhotoUrl({
                farm: gallery.farm,
                server: gallery.server,
                id: gallery.primary,
                secret: gallery.secret
            }, FlickrAPI.Size.Small);
        };
    })
    .filter('photoUrl', function(FlickrAPI) {
        return function(photo) {
            return photo ? FlickrAPI.getPhotoUrl(photo, FlickrAPI.Size.Medium) : '';
        };
    })
    .filter('photoUrlLarge', function(FlickrAPI) {
        return function(photo) {
            return photo ? FlickrAPI.getPhotoUrl(photo, FlickrAPI.Size.Large) : '';
        };
    });