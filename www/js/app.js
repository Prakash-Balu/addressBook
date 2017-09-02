// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'toaster', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $rootScope, $location, $http, $cordovaFile, ConnectivityMonitor, validateService) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        var localJSONFound;
        if (ConnectivityMonitor.isOnline()) {
            var addressData;
            if (validateService.validateLocalJsonData()) {
                addressData = angular.fromJson(validateService.getLocalJsonData(), true);
                localJSONFound = true;
            } else {
                localJSONFound = false;
            }

            $http.get('https://myapi-1a36c.firebaseapp.com/version.json')
                .success(function(versionData) {
                    var splitData = versionData.versionUrl.split('?v=');
                    var version = splitData[1];
                    if (localJSONFound) {
                        if (addressData.version != version) {
                            console.log('localdatachanged');
                            writeJSONData(versionData, version);
                        } else {
                            console.log('localdataonly');
                            $location.path('/home/users');
                        }
                    } else {
                        writeJSONData(versionData, version);
                    }

                })
                .error(function(errorData) {
                    alert('Check administrator');
                    $location.path('/error');
                });
        } else {
            if (validateService.validateLocalJsonData()) {
                localJSONFound = true;
                console.log('localdataonly-noconnection');
                $location.path('/home/users');
            } else {
                localJSONFound = false;
                $location.path('/error');
            }
        }

        function writeJSONData(versionData, version) {
            var validateFlag = false;
            $http.get(versionData.versionUrl)
                .success(function(addressData) {
                    var JSONData = {
                        version: version,
                        data: addressData
                    }

                    validateFlag = validateService.setLocalJsonData(JSONData);
                    if (validateFlag) {
                        $location.path('/home/users');
                    }
                })
                .error(function(errorData) {
                    validateFlag = false;
                });
        }
    });

})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('login', {
        url: '/login',
        abstract: false,
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
    })

    .state('error', {
        url: '/error',
        abstract: false,
        templateUrl: 'templates/404.html',
        controller: 'errorCtrl'
    })

    .state('home', {
        url: '/home',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('home.users', {
        url: '/users',
        views: {
            'menuContent': {
                templateUrl: 'templates/users.html',
                controller: 'userCtrl'
            }
        }
    })

    .state('home.userprofile', {
        url: '/userprofile',
        views: {
            'menuContent': {
                templateUrl: 'templates/user.profile.html',
                controller: 'userProfileCtrl'
            }
        },
        params: { pageTitle: 'User Profile', data: {} }
    });
    // if none of the above states are matched, use this as the fallback
    //$urlRouterProvider.otherwise('/home/users');
})

.config(['$httpProvider', function($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    // Answer edited to include suggestions from comments
    // because previous version of code introduced browser-related errors

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}]);