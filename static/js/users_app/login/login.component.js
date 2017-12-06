'use strict';

angular.module('login').
  component('login', {
    templateUrl: '/api/templates/users_app/login.html',
    controller: function(User,$cookies,$http,$location,$routeParams,$rootScope,$scope,$route,){
      var loginUrl = '/api/auth/token/'
      $scope.user = {}
      var tokenExists = $cookies.get("token")
      if (tokenExists) {
        // verify token - we want to verify this on the server
        $cookies.remove("token")
        $scope.username = {username: $cookies.get("username")}
      }

//%%%%%%%%%%%%%%%% LOGIN FUNCTION %%%%%%%%%%%%%%%%%%%%//
      $scope.doLogin = function(user){
          var userSuccess = function(response){
            $cookies.put("token", response.token)
            $cookies.put("username", user.username)

            User.query({q:user.username}).$promise.then(
              function(result){
                $scope.userdata = result
                // console.log($scope.userdata)
                $cookies.put("branch", $scope.userdata[0].branch)
                $cookies.put("calendar_condensed_view", $scope.userdata[0].calendar_condensed_view)
                $cookies.put("calendar_preference", $scope.userdata[0].calendar_preference)
                $cookies.put("startup_page", $scope.userdata[0].startup_page)
                $cookies.put("startup_page_id", $scope.userdata[0].startup_page_id)
                $cookies.put("user_id", $scope.userdata[0].id)
                var url = $scope.userdata[0].startup_page
                window.location = url;
                window.location.replace(url);
              })//function(result)
          }//userSuccess
          var userError = function(response){console.log(error)}
          User.userLogin({username: user.username, password: user.password}).$promise.then(userSuccess, userError)
        }//doLogin
    }//controller
});
