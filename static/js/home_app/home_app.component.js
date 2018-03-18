'use strict';

angular.module('homeApp').
      component('homepage', {
        templateUrl: '/api/templates/home_app/homepage.html',
        controller: function($scope,){

          $scope.staticfiles = staticfiles;


        }})
