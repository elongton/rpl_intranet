'use strict';

angular.module('admin_preferences').
  component('adminPreferences', {
    templateUrl: '/api/templates/users_app/admin_preferences.html',
    controller: function(Data, User, $cookies,$http,$location,$routeParams,$rootScope,$scope,$route,){
      //startup
      Data.getUsers().$promise.then(
                function(result){
                  $scope.users = {
                    availableOptions: result,
                    selectedOption: result[0]
                  }
                },
                function(error){console.log(error)});

      Data.getBranches().$promise.then(
                function(result){
                  $scope.branches = result
                  $scope.usercreate = {
                    selected_branch: $scope.branches[0],
                    admin: false,}
                },
                function(error){console.log(error)});

      //create user code
      $scope.createUser = function(usercreate){
        User.userCreate({username: usercreate.username,
                         password: usercreate.password,
                         branch: usercreate.branch,
                         admin: usercreate.admin,
                          }).$promise.then(
            function(success){
              console.log(success)
            },
            function(error){
              console.log(error)
            }
          )
      }



}});
