'use strict';

angular.module('events').
      component('eventsList', {
        templateUrl: '/api/templates/libcal_app/events_list.html',
        controller: function($scope, $cookies, $location,$http){
          $scope.branch = $cookies.get("branch")
          $scope.username = $cookies.get("username")
          $scope.staticfiles = staticfiles;
          var one_day = 1000*60*60*24;

          var makeaday = function(start, end){
            start.setHours(0,0,0,0);
            end.setHours(23,59,59,999);
          }
          $scope.todaybutton = function(){
            $scope.from= new Date();
            $scope.to = new Date();
            makeaday($scope.from, $scope.to);
          }
          //run today button on reload
          $scope.todaybutton();

          //managing the datepicker
          $scope.weekbutton = function(){
            $scope.to = new Date();
            $scope.from = new Date();
            var week = $scope.from.getDate() - 7;
            makeaday($scope.from, $scope.to);
            $scope.from.setDate(week);

          }
          $scope.$watch('from', function(){
            var total_days = Math.round(($scope.to.getTime() - $scope.from.getTime())/one_day);
            if ($scope.from > $scope.to){
              $scope.to = new Date($scope.from.getTime())
              makeaday($scope.from, $scope.to);
            }
            $scope.dateArray = getDates($scope.from, $scope.to);
          })
          $scope.$watch('to', function(){
            var total_days = Math.round(($scope.to.getTime() - $scope.from.getTime())/one_day);
            if ($scope.to < $scope.from){
              $scope.from = new Date($scope.to.getTime())
              makeaday($scope.from, $scope.to);
            }
            $scope.dateArray = getDates($scope.from, $scope.to);
          })


          // Step 1: Obtain array of correctly formatted dates
          // Step 2: Create a loop of $http requests that will return the arrays of bookings

          // Correct format: YYYY-MM-DD

          Date.prototype.addDays = function(days) {
              var date = new Date(this.valueOf())
              date.setDate(date.getDate() + days);
              return date;
          }

          function getDates(startDate, stopDate) {
              var dateArray = new Array();
              var currentDate = startDate;
              while (currentDate <= stopDate) {
                  var dd = currentDate.getDate();
                  var mm = currentDate.getMonth()+1; //January is 0!
                  var yyyy = currentDate.getFullYear();
                  if(dd<10) {dd = '0'+dd}
                  if(mm<10) {mm = '0'+mm}
                  dateArray.push(yyyy + '-' + mm + '-' + dd);
                  currentDate = currentDate.addDays(1);
              }
              return dateArray;
          }
          $scope.dateArray = getDates($scope.from, $scope.to);


          // PULL DATA
          $scope.pullspaces = function(iterdate){
            function successCallback(response) {
                console.log('success!')
                // console.log(response)
                return response;
              }
            function errorCallback(response) {
                console.log(response)
              }
            var endpoint = 'https://api2.libcal.com/1.1/space/bookings?lid=1598&limit=20&date=' + iterdate + '&formAnswers=1'
            // var endpoint = 'https://api2.libcal.com/1.1/space/form/2710'
            // var endpoint = 'https://api2.libcal.com/1.1/space/booking/cs_pK8YyFr&formAnswers=1'
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
          var getcreds = function(){
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
          getcreds();

          // GET EVENTS BUTTON
          $scope.get_events = function(){
            var prelimarray = new Array();
            for (var i = 0; i < $scope.dateArray.length; i++ ){
              $scope.pullspaces($scope.dateArray[i]).$promise.then(
                function(result){
                  $scope.responsedata = result.data;
                },
                function(error){
                });
              console.log($scope.responsedata)
              // prelimarray.push(responsedata);
              // console.log(prelimarray)
            }
            $scope.myarray = prelimarray;


          } //$scope.get_events()





        }//controller

        });



        // https://api2.libcal.com/1.1/space/locations
