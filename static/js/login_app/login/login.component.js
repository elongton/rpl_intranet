'use strict';

angular.module('login').
      component('login', {
        templateUrl: '/api/templates/login_app/login.html',
        controller: function(
                        User,
                        $cookies,
                        $http,
                        $location,
                        $routeParams,
                        $rootScope,
                        $scope,
                        $route,
            ){
            var loginUrl = '/api/auth/token/'
            $scope.user = {}
            var tokenExists = $cookies.get("token")
            if (tokenExists) {
              // verify token - we want to verify this on the server
              $cookies.remove("token")
              $scope.username = {
                username: $cookies.get("username")
              }
            }

//%%%%%%%%%%%%%%%%LOGIN FUNCTION %%%%%%%%%%%%%%%%%%%%//
            $scope.doLogin = function(user){
                // console.log(user)
                // shortcut way to do it:
                // var requestAction = $http.post(loginUrl, user).then(successCallback, errorCallback)

                // best way to do it:
                var reqConfig = {
                  method: "POST",
                  url: loginUrl,
                  data: {
                    username: user.username,
                    password: user.password
                  },
                  headers: {} //if there are any headers necessary for running the request
                }
                $http(reqConfig).then(successCallback, errorCallback)

                function successCallback(response){

                  $cookies.put("token", response.data.token)
                  $cookies.put("username", user.username)

                  User.query({q:user.username}).$promise.then(
                    function(result){
                      $scope.userdata = result
                      $cookies.put("branch", $scope.userdata[0].profile.branch)
                      //could be a message too
                      $location.path("/")
                      $route.reload()
                    },
                    function(error){
                      console.log(error)
                    }
                  )

                }//token
                function errorCallback(response){
                  $scope.loginError = response.data
                }//error
              }
          }//controller
});
