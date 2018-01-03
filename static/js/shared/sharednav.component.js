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
            $scope.wikiapp = function(){
              var url = "/wiki/";
              window.location = url;
              window.location.replace(url);
            }
          }
        })
        .directive('navbarBrand', function(){
            return {
            templateUrl: '/api/templates/shared/link_brand.html',
            replace:true,
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
              $scope.is_admin = ($cookies.get("is_admin") == 'true')
            }
            //Preferences
            $scope.preferences_page = function(){
              var url = "/users/preferences";
              window.location = url;
              window.location.replace(url);
            }
            //Admin Preferences
            $scope.admin_preferences_page = function(){
              var url = "/users/admin_preferences";
              window.location = url;
              window.location.replace(url);
            }

            // LOGOUT FUNCTION
            $scope.removeUser = function(){
              $cookies.remove("token")
              $cookies.remove("username")
              $cookies.remove("branch")
              $cookies.remove("is_admin")
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
