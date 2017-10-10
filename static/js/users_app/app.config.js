'use strict';

angular.module('usersApp').
            config(
              function(
                $locationProvider,
                $resourceProvider,
                $routeProvider,
              ){

                var onlyLoggedIn = function ($location,$q, $cookies) {
                    var deferred = $q.defer();
                    if ($cookies.get("token")) {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                        $location.url('/users/login');
                    }
                    return deferred.promise;
                };


                $locationProvider.html5Mode(true);
                $resourceProvider.defaults.stripTrailingSlashes = false;

                $routeProvider
                .when("/users/login", {
                  template: '<login></login>',
                  css: staticfiles('css/style.css'),
                })
                .otherwise({
                  template: "<div class='container'><h1>Page not found</h1></div>"
                })


        })

        // .controller('inputController', ['$scope', function($scope){
        //   $scope.user = 'Max'
        // }])
