'use strict';

angular.module('admin_preferences').
  component('adminPreferences', {
    templateUrl: '/api/templates/users_app/admin_preferences.html',
    controller: function(Data, User, $cookies,$http,$location,$routeParams,$rootScope,$scope,$route,){

      Data.getUsers().$promise.then(
                function(result){
                  $scope.users = {
                    availableOptions: result,
                    selectedOption: result[0]
                  }
                },
                function(error){console.log(error)});




}});
