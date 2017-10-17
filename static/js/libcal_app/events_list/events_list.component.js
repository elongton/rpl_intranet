'use strict';

angular.module('events').
      component('eventsList', {
        templateUrl: '/api/templates/libcal_app/events_list.html',
        controller: function($scope, $cookies, $location,$http, $rootScope, $q){
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
            var week = $scope.to.getDate() + 7;
            // makeaday($scope.from, $scope.to);
            $scope.to.setDate(week);

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
          $scope.eventarray = new Array();

///////////////////////   HTTP  //////////////////////////////
          // OBTAIN THE ACCESS TOKEN!
          var getcreds = function(){
            function successCallback(response) {
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
          // PULL EVENT DATA
          var pullevents = function(iterdate){
            var d = $q.defer();
            function successCallback(response) {
                var arraypush = {
                  date: iterdate,
                  eventinfo: response.data,}
                  console.log(arraypush)
                d.resolve(arraypush)
              }
            function errorCallback(response) {console.log(response)}
            var endpoint = 'https://api2.libcal.com/1.1/space/bookings?lid=1598&limit=20&date=' + iterdate + '&formAnswers=1'
            var req = {
                    method: "GET",
                    url: endpoint,
                    headers: {authorization: "Bearer " + $scope.libcaltoken},
                  }//req
            var requestAction = $http(req).then(successCallback, errorCallback)
            return d.promise;
          }


          // PULL SPACE DATA
          var pullcategories = function(){
            var d = $q.defer();
            function successCallback(response) {
              // console.log(response)
              var cids = response.data[0].categories;
              var cat_string = '';
              for (var i = 0; i < cids.length; i++){
                cat_string = cat_string.concat(cids[i].cid );
                if (i+1 < cids.length){
                  cat_string = cat_string.concat(',');
                }
              }
              d.resolve(cat_string)
            }
            function errorCallback(error) {d.reject(error)}
            //in the future, we will look up all the locations so we can obtain a full category list
            //however, for now we are not doing that
            var endpoint = 'https://api2.libcal.com/1.1/space/categories/1598'
            var req = {
                    method: "GET",
                    url: endpoint,
                    headers: {authorization: "Bearer " + $scope.libcaltoken},
                  }//req
            var requestAction = $http(req).then(successCallback, errorCallback)
            return d.promise;
          }

          var pullspaces = function(categoryList){
            function successCallback(response) {
              console.log(response)
            }
            function errorCallback(error) {console.log(error)}
            var endpoint = 'https://api2.libcal.com/1.1/space/category/' + categoryList + '?details=1'
            var req = {
                    method: "GET",
                    url: endpoint,
                    headers: {authorization: "Bearer " + $scope.libcaltoken},
                  }//req
            var requestAction = $http(req).then(successCallback, errorCallback)
          }


          $scope.get_room_info = function(){

            var promise = pullcategories();
            promise.then(function(categoryList){
              pullspaces(categoryList);
            },function(failure){console.log('this is a failure:' + failure)});

          };//get_room_info()

///////////////////////  END HTTP  //////////////////////////////

          function formatDate(date) {
            var d = new Date(date);
            var hh = d.getHours();
            var m = d.getMinutes();
            var s = d.getSeconds();
            var dd = "AM";
            var h = hh;
            if (h >= 12) {
              h = hh - 12;
              dd = "PM";
            }
            if (h == 0) {h = 12;}
            m = m < 10 ? "0" + m : m;
            s = s < 10 ? "0" + s : s;
            return h + ":" + m + " " + dd
          }
          // Get time function
          $scope.get_time = function(timestring){
            var mytime = formatDate(timestring)
            return mytime
          }
          // GET EVENTS BUTTON
          $scope.get_events = function(){

            var funcArray = new Array();
            for (var i = 0; i < $scope.dateArray.length; i++ ){
              funcArray.push(pullevents($scope.dateArray[i]));
            }

            $q.all(funcArray)
              .then(function(data){
                data.sort(function(a,b){return new Date(b.date) - new Date(a.date);}).reverse();
                var monthNames = ["January", "February", "March", "April", "May", "June",
                                  "July", "August", "September", "October", "November", "December"
                                   ];
                var dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                for (var i=0; i < data.length; i++){
                  var thedate = new Date(data[i].date);
                  var datesplit = data[i].date.split("-");
                  data[i].date = dayNames[thedate.getDay()] + ", " + monthNames[datesplit[1]-1] + ' ' + datesplit[2];
                  data[i].eventinfo.sort(function(a,b){return new Date(b.fromDate) - new Date(a.fromDate);}).reverse();
                }

                $scope.sortedarray = data;
            });
          } //$scope.get_events()
        }//controller

        });



        // https://api2.libcal.com/1.1/space/locations
