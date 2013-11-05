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
    .constant('DEFAULT_SIZE', 150)
    .constant('FLICKR_API_KEY', '<YOUR API KEY>')
    .constant('FLICKR_USER_ID', '<YOUR USER ID>')
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
        $scope.pageIsLast = function() { return $scope.page === $scope.pages; };
        $scope.pageIsFirst = function() { return $scope.page === 1; };
        $scope.showNavigation = function() { return $scope.pages > 1; };
        $scope.nextPage = function() { $scope.page++; };
        $scope.prevPage = function() { $scope.page--; };

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
    .directive('spinner', function(BLANK_IMAGE, DEFAULT_SIZE) {
        function update(elem, src, width, height) {
            elem.attr({
                src: src,
                width: width || DEFAULT_SIZE,
                height: height || DEFAULT_SIZE
            });
        }

        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                attrs.$observe('src', function(src) {
                    if (src) {
                        update(elem, BLANK_IMAGE);
                        var img = new Image();
                        img.onload = function() {
                            update(elem, src, img.width, img.height);
                        };
                        img.src = src;
                    }
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