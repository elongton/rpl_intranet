'use strict';

angular.module('navBar').
      component('navBar', {
        templateUrl: '/api/templates/libcal_app/libcal_menu.html',
        controller: function($cookies, $route, $scope, $window, $location, $rootScope){
          $scope.staticfiles = staticfiles;
        }
      });
