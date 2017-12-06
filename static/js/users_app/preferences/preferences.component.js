'use strict';

angular.module('preferences').
  component('preferences', {
    templateUrl: '/api/templates/users_app/preferences.html',
    controller: function(Data, User, $cookies,$http,$location,$routeParams,$rootScope,$scope,$route,){

      $scope.startup_page = $cookies.get("startup_page")
      $scope.startup_page_id = $cookies.get("startup_page_id")
      $scope.calendar_condensed_view = $cookies.get("calendar_condensed_view")=='true'
      $scope.calchoice = $cookies.get('calendar_preference');
      Data.getUrls().$promise.then(function(result){$scope.urls = result;}, function(error){console.log(error)});

      //initialvalues
      var startup_initial, condensed_initial, calchoice_initial
      startup_initial = $scope.startup_page_id
      condensed_initial = $scope.calendar_condensed_view
      calchoice_initial = $scope.calchoice

      $scope.updateUrl = function(urlchoice){
        $scope.startup_page = urlchoice.url
        $scope.startup_page_id = urlchoice.id
      }

      $scope.unsavedchanges = false
      $scope.$watchCollection('[startup_page_id, calchoice, calendar_condensed_view]', function(newValues, oldValues){
        if (newValues[0] != startup_initial ||
            newValues[1] != calchoice_initial ||
            newValues[2] != condensed_initial){
              $scope.unsavedchanges = true
            }else{$scope.unsavedchanges = false}
      });


      $scope.save_user = function(){

        User.userUpdate({id: $cookies.get('user_id'),
                         startup_page:$scope.startup_page_id,
                         calendar_preference:$scope.calchoice,
                         calendar_condensed_view:$scope.calendar_condensed_view})
          .$promise.then(function(result){console.log(result)}, function(error){console.log(error)});

        $scope.unsavedchanges = false
        startup_initial = $scope.startup_page_id
        condensed_initial = $scope.calendar_condensed_view
        calchoice_initial = $scope.calchoice
      }



}});
