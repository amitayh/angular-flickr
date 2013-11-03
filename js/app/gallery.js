angular.module('gallery', ['services', 'ngSanitize'])

    // Config
    .config(function($routeProvider) {
        var route = {
            templateUrl: 'templates/gallery/gallery.html',
            controller: 'GalleryCtrl'
        };

        $routeProvider.when('/gallery', {
            templateUrl: 'templates/gallery/index.html',
            controller: 'IndexCtrl'
        });
        $routeProvider.when('/gallery/:id', route);
        $routeProvider.when('/gallery/:id/:page', route);
    })
    .constant('BLANK_IMAGE', '/images/blank.gif')
    .constant('FLICKR_API_KEY', '4848c9234b56ca756586ea285be3b34a')
    .constant('FLICKR_USER_ID', '95572727@N00')
    .constant('GALLERY_ROWS', 3)
    .constant('GALLERY_COLUMNS', 3)

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
    .controller('GalleryCtrl', function($scope, $routeParams, $location, flickr, util,
                                        GALLERY_ROWS, GALLERY_COLUMNS) {

        var setId = $routeParams.id,
            page = parseInt($routeParams.page || 1),
            perPage = GALLERY_ROWS * GALLERY_COLUMNS;

        $scope.setSelectedPhoto = function(photo) { $scope.selectedPhoto = photo; };
        $scope.photoIsSelected = function(photo) { return photo.id === $scope.selectedPhoto.id; };
        $scope.pageIsFirst = function() { return $scope.page === undefined || $scope.page === 1; };
        $scope.pageIsLast = function() { return $scope.page === $scope.pages; };
        $scope.prevPage = function() { $scope.page--; };
        $scope.nextPage = function() { $scope.page++; };

        $scope.$watch('page', function(newValue, oldValue) {
            if (newValue !== oldValue && oldValue !== undefined) {
                $location.path('/gallery/' + setId + '/' + newValue);
            }
        });

        $scope.setInfo = flickr.getSetInfo(setId);
        flickr.getPhotos(setId, perPage, page).then(function(result) {
            $scope.page = page;
            $scope.pages = parseInt(result.pages);
            $scope.pagesRange = util.range(1, $scope.pages);
            $scope.photos = util.group(result.photo, GALLERY_COLUMNS);
            $scope.selectedPhoto = result.photo[0];
        });
    })

    // Directives
    .directive('spinner', function(BLANK_IMAGE) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                function changeSrc(src) {
                    elem[0].src = src;
                }
                attrs.$observe('src', function(src) {
                    changeSrc(BLANK_IMAGE);
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
    .filter('galleryThumbnail', function(FlickrAPI) {
        return function(gallery) {
            return FlickrAPI.getPhotoUrl({
                farm: gallery.farm,
                server: gallery.server,
                id: gallery.primary,
                secret: gallery.secret
            }, FlickrAPI.Size.Small);
        };
    })
    .filter('photoThumbnail', function(FlickrAPI) {
        return function(photo) {
            return photo ? FlickrAPI.getPhotoUrl(photo, FlickrAPI.Size.LargeSquare) : '';
        };
    })
    .filter('photoLarge', function(FlickrAPI) {
        return function(photo) {
            return photo ? FlickrAPI.getPhotoUrl(photo, FlickrAPI.Size.Medium640) : '';
        };
    });