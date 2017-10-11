'use strict';

angular.module('libcalApp').
      component('eventsList', {
        templateUrl: '/api/templates/libcal_app/events_list.html',
        controller: function($scope, $cookies, $window, $location){
          $scope.branch = $cookies.get("branch")
          $scope.username = $cookies.get("username")
          $scope.staticfiles = staticfiles;


          }//controller

        });
