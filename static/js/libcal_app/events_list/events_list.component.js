'use strict';

angular.module('events').
      component('eventsList', {
        templateUrl: '/api/templates/libcal_app/events_list.html',
        controller: function($scope, $cookies, $location){
          $scope.branch = $cookies.get("branch")
          $scope.username = $cookies.get("username")
          $scope.staticfiles = staticfiles;

          // HTTP WAY OF DOING THINGS
          $scope.getcreds = function(){
            var createUrl = 'https://api2.libcal.com/1.1/oauth/token'
            var req = {
                          method: "POST",
                          url: createUrl,
                          data: {
                            client_id: '135',
                            client_secret: 'blah',
                            grant_type: 'client_credentials',
                          },
                          headers: {
                            // authorization: "JWT " + token
                          },
                      }//req

            var requestAction = $http(req).then(successCallback, errorCallback)

          }

        }//controller

        });
