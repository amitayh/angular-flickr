angular.module('services').factory('Pagination', function(util) {

    function Pagination(page, perPage, pages) {
        this.page = page;
        this.perPage = perPage;
        this.pages = pages || -1;
    }

    Pagination.prototype.isFirst = function() {
        return this.page == 1;
    };

    Pagination.prototype.isCurrent = function(page) {
        return page == this.page;
    };

    Pagination.prototype.isLast = function() {
        return this.page == this.pages;
    };

    Pagination.prototype.isValid = function(page) {
        return (page >= 1 && page <= this.pages);
    };

    Pagination.prototype.nextPage = function() {
        var next = this.page + 1;
        return this.isValid(next) ? next : null;
    };

    Pagination.prototype.prevPage = function() {
        var prev = this.page - 1;
        return this.isValid(prev) ? prev : null;
    };

    Pagination.prototype.pagesRange = function() {
        return util.range(1, this.pages);
    };

    return Pagination;
});