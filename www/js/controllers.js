angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    // $scope.loginData = {};

    // // Create the login modal that we will use later
    // $ionicModal.fromTemplateUrl('templates/login.html', {
    //   scope: $scope
    // }).then(function(modal) {
    //   $scope.modal = modal;
    // });

    // // Triggered in the login modal to close it
    // $scope.closeLogin = function() {
    //   $scope.modal.hide();
    // };

    // // Open the login modal
    // $scope.login = function() {
    //   $scope.modal.show();
    // };

    // // Perform the login action when the user submits the login form
    // $scope.doLogin = function() {
    //   console.log('Doing login', $scope.loginData);

    //   // Simulate a login delay. Remove this and replace with your login
    //   // code if using a login system
    //   $timeout(function() {
    //     $scope.closeLogin();
    //   }, 1000);
    // };

    $scope.navigate = function(path) {
        $location.path("/" + path);
    };
})

.controller('loginCtrl', function($scope, $state, toaster) {
    $scope.data = {
        username: '',
        password: ''
    };

    $scope.login = function() {
        if ($scope.data.name == '' || $scope.data.password == '') {
            toaster.pop({
                type: 'error',
                body: 'Please fill out all fields!...',
                timeout: 1000
            });
        } else {
            if ($scope.data.username == 'admin') {
                if ($scope.data.password == 'thamarai') {
                    $state.go('home.users');
                } else {
                    toaster.pop({
                        type: 'error',
                        body: 'Username and password does not match',
                        timeout: 1000
                    });
                }
            } else {
                toaster.pop({
                    type: 'error',
                    body: 'Username does not exists',
                    timeout: 1000
                });
            }
        }

    };
})

.controller('userCtrl', function($scope, $state, userService) {
    var users = [];
    var userList = [];
    $scope.searchVal = '';
    var area = $state.params.data;

    console.log(area);

    function init() {
        getUserList();
    };

    function getUserList() {
        var JSONData = angular.fromJson(userService.getUsers());
        users = JSONData.data.Sheet1;
        getuserListByArea();
    };

    function searchUserData(searchVal) {
        $scope.tmpUsers = angular.copy(userList);
        if (searchVal != '') {
            var newArray = [];
            angular.forEach($scope.tmpUsers, function(value, key) {
                if ((value.name.toLowerCase().indexOf(searchVal.toLowerCase())) != -1) {
                    newArray.push(value);
                }
            });
            $scope.tmpUsers = newArray;
        }
    }

    $scope.searchUsers = function(searchVal) {
        searchUserData(searchVal);
    };

    $scope.getDetails = function(userData) {
        $state.go('home.userprofile', { data: userData });
    };

    function getuserListByArea() {
        userList = angular.copy(users);
        if (area != '') {
            var newArray1 = [];
            angular.forEach(userList, function(value1, key1) {
                if ((value1.area.toLowerCase().indexOf(area.toLowerCase())) != -1) {
                    newArray1.push(value1);
                }
            });
            userList = newArray1;
        }

        searchUserData($scope.searchVal);
    };

    //Call function initialization
    init();
})

.controller('locationCtrl', function($scope, $state, locationService) {
    $scope.locations = {};

    function init() {
        getLocationList();
    };

    function getLocationList() {
        var locationData = angular.fromJson(locationService.getLocationList());

        console.log(locationData);
        $scope.locations = locationData.cities;
    };

    $scope.getAreaList = function(city) {
        $state.go('home.area', { data: city });
    };

    //Call function initialization
    init();
})

.controller('areaCtrl', function($scope, $stateParams, $state) {
    $scope.areaList = $stateParams.data;

    $scope.getAreaUserList = function(area) {
        console.log(area);
        $state.go('home.users', { data: area });
    };
})

.controller('userProfileCtrl', function($scope, $stateParams) {
    $scope.userProfileData = $stateParams.data;
})

.controller('userListByArea', function($scope, $stateParams, userService) {
    $scope.area = $stateParams.data;

    getUserList();

    function getUserList() {
        var JSONData = angular.fromJson(userService.getUsers());
        users = JSONData.data.Sheet1;
        userListByArea($scope.area);
    };

    function userListByArea(areaName) {
        if (areaName != '') {
            var newArray = [];
            angular.forEach($scope.tmpUsers, function(value, key) {
                if ((value.area.toLowerCase().indexOf(areaName.toLowerCase())) != -1) {
                    newArray.push(value);
                }
            });
            $scope.tmpUsers = newArray;
        }
    }

    $scope.getDetails = function(city) {
        $state.go('home.area', { data: city });
    };
})

.controller('error404Ctrl', function($scope) {
    $scope.exit = function() {
        ionic.Platform.exitApp();
    };

    $scope.settings = function() {
        if (window.cordova && window.cordova.plugins.settings) {
            console.log('openNativeSettingsTest is active');
            window.cordova.plugins.settings.open("settings", function() {
                    console.log('opened settings');
                    $scope.exit();
                },
                function() {
                    console.log('failed to open settings');
                    $scope.exit();
                }
            );
        } else {
            console.log('openNativeSettingsTest is not active!');
            $scope.exit();
        }
    };
})

.controller('error500Ctrl', function($scope) {
    $scope.exit = function() {
        ionic.Platform.exitApp();
    };
});