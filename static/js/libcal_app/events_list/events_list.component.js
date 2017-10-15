'use strict';

angular.module('events').
      component('eventsList', {
        templateUrl: '/api/templates/libcal_app/events_list.html',
        controller: function($scope, $cookies, $location,$http){
          $scope.branch = $cookies.get("branch")
          $scope.username = $cookies.get("username")
          $scope.staticfiles = staticfiles;

          // PULL DATA
          $scope.pullspaces = function(){
            function successCallback(response) {
                console.log('success!')
                console.log(response)
              }
            function errorCallback(response) {
                console.log(response)
              }
            // var endpoint = 'https://api2.libcal.com/1.1/space/bookings?lid=1598&limit=20&date=2017-12-30&formAnswers=1'
            // var endpoint = 'https://api2.libcal.com/1.1/space/form/2710'
            var endpoint = 'https://api2.libcal.com/1.1/space/booking/cs_pK8YyFr&formAnswers=1'
            var req = {
                          method: "GET",
                          url: endpoint,
                          headers: {
                            authorization: "Bearer " + $scope.libcaltoken
                          },
                      }//req
            var requestAction = $http(req).then(successCallback, errorCallback)
          }





          // OBTAIN THE ACCESS TOKEN!
          $scope.getcreds = function(){
            function successCallback(response) {
                // console.log('success!')
                // console.log(response)
                $scope.libcaltoken = response.data.access_token
              }
            function errorCallback(response) {
                console.log(response)
              }
            var token_url = 'https://api2.libcal.com/1.1/oauth/token'
            var req = {
                          method: "POST",
                          url: token_url,
                          data: {
                            client_id: '135',
                            client_secret: '906a3eab0c7f08ebad67e5160f0ae951',
                            grant_type: 'client_credentials',
                          },
                          headers: {
                            // authorization: "JWT " + token
                          },
                      }//req
            var requestAction = $http(req).then(successCallback, errorCallback)
          }
          // call getcreds on page load
          $scope.getcreds();

        }//controller

        });



        // https://api2.libcal.com/1.1/space/locations
