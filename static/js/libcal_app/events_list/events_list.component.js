'use strict';

angular.module('events').
      component('eventsList', {
        templateUrl: '/api/templates/libcal_app/events_list.html',
        controller: function($scope, $cookies, $location){
          $scope.branch = $cookies.get("branch")
          $scope.username = $cookies.get("username")
          $scope.staticfiles = staticfiles;
        }//controller

        });
