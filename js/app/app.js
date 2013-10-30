angular.module('angular-flickr', ['gallery'])

    .config(function($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/gallery'});
    });