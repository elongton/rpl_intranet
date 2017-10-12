'use strict';

angular.module('navBar').
      component('navBar', {
        templateUrl: '/api/templates/reference_app/reference_menu.html',
        controller: function($cookies, $route, $scope, $window, $location, $rootScope){


          // on page link functions
          $scope.loadhomepage = function(){
            // $route.reload()
            var url = "/";
            window.location = url;
            window.location.replace(url);
          }
          $scope.opencontrols = function(){
              // console.log($cookies.get("username"))
              // console.log($cookies.get("token"))
              $scope.controlswindow = $window.open("/reference/controls", "controlswindow", "width=300, height=530");
            };

          $scope.navinfopage = function(){
              $location.url('/reference/info')
          }

          $scope.staticfiles = staticfiles;


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


          // scope.userLoggedIn = $cookies.get("token")
          // console.log($cookies.get("token"))

        }
      });

//
// 'use strict';
//
// angular.module('navBar', [])
//   .controller('NavbarController', function($scope, $window) {
//     $scope.opencontrols = function(){
//         $window.open("/controls", "Controller", "width=300, height=500");
//       };
//   })
//   .directive('navBar', function() {
//     return {
//       restrict: "E",
//       templateUrl: '/api/templates/menu.html',
//     };
//   });
