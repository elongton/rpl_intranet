'use strict';

angular.module('usersApp').
            config(
              function(
                $locationProvider,
                $resourceProvider,
                $routeProvider,
              ){

                var onlyLoggedIn = function (User, $location,$q, $cookies,) {
                    var deferred = $q.defer();
                    if ($cookies.get("token")){
                      User.tokenVerify({token: $cookies.get("token")}).$promise.then(
                        function(success){
                          deferred.resolve();
                        },//success,
                        function(error){
                          rejection(deferred);
                          console.log(error)
                        }//error
                      )//user.tokenVerify
                    }else{
                      rejection(deferred);
                    }//else

                    function rejection(deferral){
                      deferral.reject();
                      var url = "/users/login";
                      window.location = url;
                      window.location.replace(url);
                    }
                    return deferred.promise;
                };


                var adminLogin = function (User, $location,$q, $cookies,) {
                    var deferred = $q.defer();
                    if ($cookies.get("is_admin") == 'true'){
                          deferred.resolve();
                    }else{
                      rejection(deferred);
                    }//else

                    function rejection(deferral){
                      deferral.reject();
                      var url = "/";
                      window.location = url;
                      window.location.replace(url);
                    }
                    return deferred.promise;
                };


                $locationProvider.html5Mode(true);
                $resourceProvider.defaults.stripTrailingSlashes = false;

                $routeProvider
                .when("/users/login", {
                  template: '<login></login>',
                  css: [staticfiles('css/users_style.css'),staticfiles('css/menu_style.css')],
                })
                .when("/users/preferences", {
                  template: '<preferences></preferences>',
                  css: [staticfiles('css/users_style.css'),staticfiles('css/menu_style.css')],
                  resolve:{
                    loggedIn:onlyLoggedIn,
                  },
                })
                .when("/users/admin_preferences", {
                  template: '<admin-preferences></admin-preferences>',
                  css: [staticfiles('css/users_style.css'),staticfiles('css/menu_style.css')],
                  resolve:{
                    loggedIn:onlyLoggedIn,
                    isAdmin:adminLogin,
                  },
                })
                .otherwise({
                  template: "<div class='container'><h1>Page not found</h1></div>"
                })


        })

        // .controller('inputController', ['$scope', function($scope){
        //   $scope.user = 'Max'
        // }])
