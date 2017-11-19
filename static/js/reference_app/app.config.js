'use strict';

angular.module('referenceApp')
    .config(
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


          $locationProvider.html5Mode(true);
          $resourceProvider.defaults.stripTrailingSlashes = false;

          $routeProvider
          .when('/reference',{
            template: '<stats></stats>',
            resolve:{
              loggedIn:onlyLoggedIn
            },
            css: staticfiles('css/style.css'),
          })
          .when("/reference/controls", {
            template: '<controls></controls>',
            css: staticfiles('css/controls.css'),
          })
          .when("/reference/info", {
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
