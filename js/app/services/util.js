angular.module('services').factory('util', function() {
    return {
        getQueryString: function(params) {
            var result = [];
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    result.push(key + '=' + encodeURIComponent(params[key]));
                }
            }
            return result.join('&');
        },
        range: function(min, max, step) {
            var result = [];
            step = step || 1;
            for (var i = min; i <= max; i += step) {
                result.push(i);
            }
            return result;
        },
        group: function(data, groupSize) {
            var result = [], group = [];
            for (var i = 0, l = data.length; i < l; i++) {
                group.push(data[i]);
                if ((i + 1) % groupSize == 0) {
                    result.push(group);
                    group = []
                }
            }
            if (group.length > 0) {
                result.push(group);
            }
            return result;
        }
    };
});