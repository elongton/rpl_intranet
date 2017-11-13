'use strict';

angular.module('events').
      component('eventsList', {
        templateUrl: '/api/templates/libcal_app/events_list.html',
        controller: function(Dates, $scope, $cookies, $location, $http, $rootScope, $q, $window, $document, $interval,){
          $scope.branch = $cookies.get("branch")
          $scope.username = $cookies.get("username")
          $scope.staticfiles = staticfiles;

          //animating the buttons in mobile:

          var downanimation = function(){
            $scope.dates_button_class = 'animate_date_button_up';
            $scope.menu_position = !$scope.menu_position
          }
          var upanimation = function(){
              $scope.dates_button_class = 'animate_date_button_down';
              $scope.menu_position = !$scope.menu_position
          }//addanimation()

          //actual menu
          $scope.is_shown = 'nodisplay';
          $scope.showmenu = function(){$scope.is_shown = '';}
          $scope.hidemenu = function(){$scope.is_shown = 'nodisplay';}

          //MOBILE STUFF
          //scroll direction code:
          $scope.lastScrollTop = 0;
          $scope.direction = "";

          var didScroll = false;
          angular.element($window).on("scroll", function() {
            $scope.didScroll = true;
            $scope.scrollheight = window.pageYOffset;
          })

          $interval(function() {
              if($scope.didScroll) {
                  $scope.didScroll = false;
                  $scope.st = window.pageYOffset;
                  if ($scope.st > $scope.lastScrollTop) {
                      $scope.direction = "down";
                      if($scope.scrollheight > 100){
                        upanimation();
                      }
                  }else{
                      $scope.direction = "up";
                      downanimation();
                  }
                  $scope.lastScrollTop = $scope.st;
              }
          }, 500);




          //TIME STUFF
          Dates();


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
            $scope.loading_display = 'loadshow';
            $scope.loading_blur = 'page_blur';
            function successCallback(response) {
                var arraypush = {
                  date: iterdate,
                  eventinfo: response.data,}
                  console.log(arraypush)
                d.resolve(arraypush)
                $scope.loading_display = '';
                $scope.loading_blur = '';
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
            $scope.loading_display = 'loadshow';
            $scope.loading_blur = 'page_blur';
            var promise = getcreds();
            promise.then(function(){
              get_room_info();
            },function(){console.log(failure)}
            )
          }
          page_startup();


///////////////////////  END HTTP  //////////////////////////////

          function formatDate(date){
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
