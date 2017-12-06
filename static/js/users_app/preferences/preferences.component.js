'use strict';

angular.module('preferences').
  component('preferences', {
    templateUrl: '/api/templates/users_app/preferences.html',
    controller: function($cookies,$http,$location,$routeParams,$rootScope,$scope,$route,){

      $scope.preferences = 'hello';
      $scope.startup_page = $cookies.get("startup_page")
}});
