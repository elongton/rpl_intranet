'use strict';

angular.module('referenceApp')
    .config(
      ['cfpLoadingBarProvider', function(cfpLoadingBarProvider){
        //loading bar
        cfpLoadingBarProvider.parentSelector = '#csv_modal_content';
        // cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Custom Loading Message...</div>';
      }]
    )
    .config(
      function(
        $locationProvider,
        $resourceProvider,
        $routeProvider,
        cfpLoadingBarProvider,
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
            template: '<maintenance></maintenance>',
            resolve:{
              loggedIn:onlyLoggedIn
            },
            css:[staticfiles('css/ref_style.css'),staticfiles('css/menu_style.css')],
          })
          .when("/reference/controls", {
            template: '<controls></controls>',
            css:[staticfiles('css/controls.css'),staticfiles('css/menu_style.css')],
          })
          .when("/reference/info", {
            template: '<infopage></infopage>',
            css:[staticfiles('css/ref_style.css'),staticfiles('css/menu_style.css')],
          })
          .otherwise({
            template: "<div class='container'><h1>Page not found</h1></div>"
          })
        })

        // .controller('inputController', ['$scope', function($scope){
        //   $scope.user = 'Max'
        // }])
