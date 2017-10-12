'use strict';

angular.module('navBar').
      component('navBar', {
        templateUrl: '/api/templates/home_app/home_menu.html',
        controller: function($cookies, $route, $scope, $window, $location, $rootScope){

          // on page link functions
          $scope.referenceapp = function(){
            var url = "/reference";
            window.location = url;
            window.location.replace(url);
          }
          $scope.libcalapp = function(){
            var url = "/libcal";
            window.location = url;
            window.location.replace(url);
          }

          //other
          $scope.staticfiles = staticfiles;
          $scope.reloadpage = function(){
            $route.reload()
          }

          $scope.userLoggedIn = false
          var token = $cookies.get("token")
          if (token) {
            $rootScope.userLoggedIn = true
            $scope.userLoggedIn = $rootScope.userLoggedIn
            $scope.username = $cookies.get("username")
          }

          // LOGOUT FUNCTION
          $scope.removeUser = function(){
            $cookies.remove("token")
            $cookies.remove("username")
            $cookies.remove("branch")
            // $cookies.remove()
            // console.log($cookies.get("branch"))

            $rootScope.userLoggedIn = false
            if ($scope.controlswindow && !$scope.controlswindow.closed){
                $scope.controlswindow.close();
            }
            // $route.reload()
            var url = "/users/login";
            window.location = url;
            window.location.replace(url);
          }

          //CLOSE WINDOW function
          $window.onunload = function() {
              if ($scope.controlswindow && !$scope.controlswindow.closed){
                  $scope.controlswindow.close();
              }
          };


        }
      });
