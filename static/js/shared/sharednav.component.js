'use strict';

  angular.module('sharednav')
        .component('linkDropdown', {
          templateUrl: '/api/templates/shared/link_dropdown.html',
          // styles: ['.rpl-links{cursor: pointer;}'],
          controller: function($scope){
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

          }

        })
        .component('navbarBrand', {
          templateUrl: '/api/templates/shared/link_brand.html',
          controller: function($scope){
            $scope.staticfiles = staticfiles;
            $scope.loadhomepage = function(){
              // $route.reload()
              var url = "/";
              window.location = url;
              window.location.replace(url);
            }
          }
        })
        .component('navbarLogout',{
          templateUrl: '/api/templates/shared/link_logout.html',
          controller: function($scope, $cookies, $rootScope){
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


          }
        })
