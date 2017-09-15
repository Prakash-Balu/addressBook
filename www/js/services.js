angular.module('starter.services', [])

.service('userService', function(validateService) {
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

    this.validateLocalLocationJsonData = function() {
        if (window.localStorage['locationData'] == undefined) {
            return false;
        } else {
            return true;
        }
    };

    this.getLocalLocationJsonData = function() {
        return window.localStorage['locationData'];
    };

    this.setLocalLocationJsonData = function(locationData) {
        if (locationData != undefined) {
            var locationJsonData = {
                cities: {}
            };
            angular.forEach(locationData, function(value, key) {
                angular.forEach(value, function(value1, key1) {
                    if (!locationJsonData.cities.hasOwnProperty(value1.city))
                        locationJsonData.cities[value1.city] = [];

                    if (locationJsonData.cities[value1.city].indexOf(value1.area) == -1)
                        locationJsonData.cities[value1.city].push(value1.area)
                });

            });

            window.localStorage.setItem('locationData', angular.toJson(locationJsonData));
        }
        return (this.validateLocalLocationJsonData());
    };
})

.service('locationService', function(validateService) {
    this.getLocationList = function() {
        return validateService.getLocalLocationJsonData();
    };
});