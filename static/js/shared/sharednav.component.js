'use strict';

// angular.module('sharednav')
//   .directive('linkDropdown', function(){
//       return {
//         templateUrl: '/api/templates/shared/link_dropdown.html',
//       }
//
//   })

  angular.module('sharednav')
        .component('linkDropdown', {
          templateUrl: '/api/templates/shared/link_dropdown.html',
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
