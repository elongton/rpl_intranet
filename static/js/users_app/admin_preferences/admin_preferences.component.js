'use strict';

angular.module('admin_preferences').
  component('adminPreferences', {
    templateUrl: '/api/templates/users_app/admin_preferences.html',
    controller: function(Data, User, $cookies,$http,$location,$routeParams,$rootScope,$scope,$route,){

      // $scope.startup_page = $cookies.get("startup_page")
      // $scope.startup_page_id = $cookies.get("startup_page_id")
      // $scope.calendar_condensed_view = $cookies.get("calendar_condensed_view")=='true'
      // $scope.calchoice = $cookies.get('calendar_preference');
      Data.getUsers().$promise.then(
                function(result){
                  $scope.users = {
                    availableOptions: result,
                    selectedOption: result[0]
                  }
                },
                function(error){console.log(error)});


      // $scope.updateUrl = function(urlchoice){
      //   $scope.startup_page = urlchoice.url
      //   $scope.startup_page_id = urlchoice.id
      // }

      // $scope.unsavedchanges = false
      // $scope.$watchCollection('[startup_page_id, calchoice, calendar_condensed_view]', function(newValues, oldValues){
      //   if (newValues[0] != startup_initial ||
      //       newValues[1] != calchoice_initial ||
      //       newValues[2] != condensed_initial){
      //         $scope.unsavedchanges = true
      //       }else{$scope.unsavedchanges = false}
      // });


      // $scope.save_user = function(){
      //
      //   User.userUpdate({id: $cookies.get('user_id'),
      //                    startup_page:$scope.startup_page_id,
      //                    calendar_preference:$scope.calchoice,
      //                    calendar_condensed_view:$scope.calendar_condensed_view})
      //     .$promise.then(function(result){console.log(result)}, function(error){console.log(error)});
      //
      //   $scope.unsavedchanges = false
      //   startup_initial = $scope.startup_page_id
      //   condensed_initial = $scope.calendar_condensed_view
      //   calchoice_initial = $scope.calchoice
      // }



}});
