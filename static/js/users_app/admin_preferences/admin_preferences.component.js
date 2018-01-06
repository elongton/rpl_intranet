'use strict';

angular.module('admin_preferences').
  component('adminPreferences', {
    templateUrl: '/api/templates/users_app/admin_preferences.html',
    controller: function(Data, User, $filter, $cookies,$http,$location,$routeParams,$rootScope,$scope,$route,){
      //startup
      $scope.deletecrucible = false

      var getUsers = function(){
        Data.getUsers().$promise.then(
                  function(result){
                    $scope.users = {
                      availableOptions: result,
                      selectedOption: result[0]
                    }
                  },
                  function(error){console.log(error)});
      }
      //get some data
      Data.getBranches().$promise.then(
        function(result){
          $scope.branches = result
          $scope.usercreate = {
            selected_branch: $scope.branches[0],
            admin: false,}
            //sequence...
            getUsers();

        },
        function(error){console.log(error)});


      $scope.clearfields = function(){
        $scope.usercreate = {email: '', selected_branch: $scope.branches[0]}
        $scope.useredit = {email: ''}
        $scope.deletecrucible = false;
      }


      // $scope.useredit = {}
      $scope.$watch('useredit', function(){
        console.log($scope.useredit.branch)
      })
      //edit user code
      $scope.editUser = function(useredit, selectedoption){
        User.userUpdate({id: selectedoption.id,
                         password: useredit.password,
                         // branch: useredit.branch.id,
                         email: useredit.email,
                         admin: useredit.is_admin,
                        })
          .$promise.then(function(result){console.log(result)}, function(error){console.log(error)});
      }//editUser

      //create user code
      $scope.createUser = function(usercreate){
        User.userCreate({username: usercreate.username,
                         password: usercreate.password,
                         branch: usercreate.selected_branch.id,
                         admin: usercreate.admin,
                         email: usercreate.email,
                          }).$promise.then(
            function(success){
              console.log(success)
              getUsers();
            },
            function(error){
              console.log(error)
            }
          )
          $scope.clearfields()}

      //delete user code

      $scope.deletetoggle = function(){
        $scope.deletecrucible = !$scope.deletecrucible;
      }

      $scope.deleteUser = function(user_id){
        User.userDelete({id: user_id}).$promise.then(
          function(success){
            console.log(success)
            getUsers();
        },
        function(error){console.log(error)}
      )
      $scope.clearfields()
      };




//deleteUser(users.selectedOption.id)


}});




// watch to see if different user is selected.
// $scope.$watch(function(){
//   if ($scope.users){
//     $scope.useredit = {
//       branch: $filter('filter')($scope.branches, $scope.users.selectedOption.branch)[0],
//     }//$scope.useredit
//   }//if
// })//$scope.watch``
