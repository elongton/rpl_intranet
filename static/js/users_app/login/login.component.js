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
                $cookies.put("branch", $scope.userdata[0].branch)
                var url = "/libcal";
                window.location = url;
                window.location.replace(url);
              })//function(result)
          }//userSuccess
          var userError = function(response){console.log(error)}
          User.userLogin({username: user.username, password: user.password}).$promise.then(userSuccess, userError)
        }//doLogin
    }//controller
});
