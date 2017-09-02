angular.module('starter.services', [])

.service('userService', function($http, validateService) {
    this.getUsers = function() {
        return validateService.getLocalJsonData();
    };
})

.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork) {

    return {
        isOnline: function() {
            if (ionic.Platform.isWebView()) {
                return $cordovaNetwork.isOnline();
            } else {
                return navigator.onLine;
            }
        },
        isOffline: function() {
            if (ionic.Platform.isWebView()) {
                return !$cordovaNetwork.isOnline();
            } else {
                return !navigator.onLine;
            }
        },
        startWatching: function() {
            if (ionic.Platform.isWebView()) {

                $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
                    console.log("went online");
                });

                $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
                    console.log("went offline");
                });

            } else {
                window.addEventListener("online", function(e) {
                    console.log("went online");
                }, false);

                window.addEventListener("offline", function(e) {
                    console.log("went offline");
                }, false);
            }
        }
    };
})

.service('validateService', function($http, $q) {
    this.validateLocalJsonData = function() {
        if (window.localStorage['addressData'] == undefined) {
            return false;
        } else {
            return true;
        }
    };

    this.getLocalJsonData = function() {
        return window.localStorage['addressData'];
    };

    this.setLocalJsonData = function(JSONData) {
        window.localStorage.setItem('addressData', angular.toJson(JSONData));
        return (this.validateLocalJsonData());
    };
});