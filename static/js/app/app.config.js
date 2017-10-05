'use strict';

angular.module('referenceApp').
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
                        $location.url('/login');
                    }
                    return deferred.promise;
                };


                $locationProvider.html5Mode(true);

                $resourceProvider.defaults.stripTrailingSlashes = false;

                $routeProvider
                .when('/',{
                  template: '<stats></stats>',
                  resolve:{
                    loggedIn:onlyLoggedIn
                  },
                  css: staticfiles('css/style.css'),
                })
                .when("/controls", {
                  template: '<controls></controls>',
                  css: staticfiles('css/controls.css'),
                })
                .when("/login", {
                  template: '<login></login>',
                  css: staticfiles('css/style.css'),
                })
                .when("/info", {
                  template: '<infopage></infopage>',
                  css: staticfiles('css/style.css'),
                })
                .otherwise({
                  template: "<div class='container'><h1>Page not found</h1></div>"
                })


        })

        // .controller('inputController', ['$scope', function($scope){
        //   $scope.user = 'Max'
        // }])
