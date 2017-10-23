'use strict';

angular.module('events').
      component('eventsList', {
        templateUrl: '/api/templates/libcal_app/events_list.html',
        controller: function($scope, $cookies, $location,$http, $rootScope, $q, $window, $document, $interval){
          $scope.branch = $cookies.get("branch")
          $scope.username = $cookies.get("username")
          $scope.staticfiles = staticfiles;

          //animating the buttons in mobile:

          var downanimation = function(){
            $scope.dates_button_class = 'animate_date_button_up';
            // $scope.header_shown = '';
            $scope.menu_position = !$scope.menu_position
          }
          var upanimation = function(){
              $scope.dates_button_class = 'animate_date_button_down';
              // $scope.header_shown = 'header-opacity';
              $scope.menu_position = !$scope.menu_position
          }//addanimation()

          //actual menu
          $scope.is_shown = 'nodisplay';

          $scope.showmenu = function(){$scope.is_shown = '';}
          $scope.hidemenu = function(){$scope.is_shown = 'nodisplay';}


          //scroll direction code:
          $scope.lastScrollTop = 0;
          $scope.direction = "";


          var didScroll = false;

          function doThisStuffOnScroll() {
              didScroll = true;
              $scope.st = window.pageYOffset;
              if ($scope.st > $scope.lastScrollTop) {
                  $scope.direction = "down";
                  upanimation();
              } else {
                  $scope.direction = "up";
                  downanimation();
              }

              $scope.lastScrollTop = $scope.st;
              $scope.$apply();
              // console.log($scope.direction);
          }

          angular.element($window).on("scroll", function() {
            doThisStuffOnScroll();
          })

          $interval(function() {
              if(didScroll) {
                  didScroll = false;
                  // console.log('You scrolled');
              }
          }, 100);





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

          $scope.add_day_button = function(){
            // $scope.to = new Date();
            var dummy_date = new Date();
            dummy_date.setDate($scope.from.getDate() + 1)
            // makeaday($scope.from, $scope.to);
            $scope.from = dummy_date;
            $scope.to = $scope.from;
          }


          $scope.lose_day_button = function(){
            // $scope.to = new Date();
            var dummy_date = new Date();
            dummy_date.setDate($scope.to.getDate() - 1)
            // makeaday($scope.from, $scope.to);
            $scope.to = dummy_date;
            $scope.from = $scope.to;
          }

          $scope.add_week_button = function(){
            // $scope.to = new Date();
            var dummy_date = new Date();
            dummy_date.setDate($scope.from.getDate() + 7)
            // makeaday($scope.from, $scope.to);
            $scope.from = dummy_date;
            $scope.to = $scope.from;
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
            var d = $q.defer();
            function successCallback(response) {
              d.resolve($scope.libcaltoken = response.data.access_token)
              }
            function errorCallback(response) {
                d.reject(response)
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
            return d.promise;
          }//getcreds()
          // call getcreds on page load
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
          }//pullevents()


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
            function errorCallback(error) {d.reject('total error zone baby')}
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
          }//pullcategories()

          var pullspaces = function(categoryList){
            var d = $q.defer();
            function successCallback(response) {
              //this is where you create the room array
              var raw_spaces_list = new Array();
              for (var i=0; i < response.data.length; i++){
                raw_spaces_list = raw_spaces_list.concat(response.data[i].items)
              }
              $scope.spaces_dict = {};
              for (var i=0; i< raw_spaces_list.length; i++){
                var dictval = raw_spaces_list[i].id;
                $scope.spaces_dict[dictval] = raw_spaces_list[i].name
              }
              d.resolve()
            }
            function errorCallback(error) {console.log(error); getcreds();}
            var endpoint = 'https://api2.libcal.com/1.1/space/category/' + categoryList + '?details=1'
            var req = {
                    method: "GET",
                    url: endpoint,
                    headers: {authorization: "Bearer " + $scope.libcaltoken},
                  }//req
            var requestAction = $http(req).then(successCallback, errorCallback)
            return d.promise;
          }//pullspaces()

          var get_initial_data = function(categoryList){
            var promise = pullspaces(categoryList);
            promise.then(function(){
              $scope.get_events();
            }, function(failure){console.log(failure)});
          }

          var get_room_info = function(){
            var promise = pullcategories();
            promise.then(function(categoryList){
              get_initial_data(categoryList);
            },function(failure){console.log(failure)});
          };//get_room_info()

          var page_startup = function(){
            var promise = getcreds();
            promise.then(function(){
              get_room_info();
            },function(){console.log(failure)}
            )
          }
          page_startup();


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

          $scope.get_room_key = function(eid){
            return $scope.spaces_dict[eid]
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

                  //lets create an array just for keys that start with 'q'

                  for (var j=0; j < data[i].eventinfo.length; j++){
                    var qdict = {}
                    // data[i].eventinfo[j].questions = {};
                    for (var key in data[i].eventinfo[j]){
                      // console.log(typeof(key))
                      if (key[0] == 'q'){
                        qdict[key] = data[i].eventinfo[j][key]
                      }//if
                    }//for var key
                    data[i].eventinfo[j].questions = qdict
                  }//for var j=0



                }

                $scope.sortedarray = data;
                // console.log(data);
            });
          } //$scope.get_events()

        }//controller

        });



        // https://api2.libcal.com/1.1/space/locations
