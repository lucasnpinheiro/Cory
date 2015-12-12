angular.module('starter').config(['$httpProvider', function($httpProvider) {
        //$httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        //$httpProvider.defaults.headers.common = 'Content-Type: application/x-www-form-urlencoded';
        //delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.defaults.cache = false;
    }
])