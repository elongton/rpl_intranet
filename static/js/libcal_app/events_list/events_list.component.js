'use strict';

angular.module('events').
      component('eventsList', {
        templateUrl: '/api/templates/libcal_app/events_list.html',
        controller: function(lcFuncs, lcData, $scope, $cookies, $location, $http, $rootScope, $q, $window, $document, $interval){
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
          }, 500);//$interval

          //TIME STUFF
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
            $scope.to.setDate(week);
          }

          $scope.add_day_button = function(){
            var dummy_date = new Date();
            dummy_date.setMonth($scope.from.getMonth())
            dummy_date.setDate($scope.from.getDate() + 1)
            $scope.from = new Date(dummy_date);
            $scope.to = $scope.from;
          }

          $scope.lose_day_button = function(){
            var dummy_date = new Date();
            dummy_date.setDate($scope.to.getDate() - 1)
            dummy_date.setMonth($scope.to.getMonth())
            $scope.to = dummy_date;
            $scope.from = $scope.to;
          }

          $scope.add_week_button = function(){
            var dummy_date = new Date();
            dummy_date.setDate($scope.from.getDate() + 7)
            $scope.from = dummy_date;
            $scope.to = $scope.from;
          }

          $scope.$watch('from', function(){
            var total_days = Math.round(($scope.to.getTime() - $scope.from.getTime())/one_day);
            if ($scope.from > $scope.to){
              $scope.to = new Date($scope.from.getTime())
              makeaday($scope.from, $scope.to);
            }
            $scope.dateArray = lcFuncs.getDates($scope.from, $scope.to);
          })

          $scope.$watch('to', function(){
            var total_days = Math.round(($scope.to.getTime() - $scope.from.getTime())/one_day);
            if ($scope.to < $scope.from){
              $scope.from = new Date($scope.to.getTime())
              makeaday($scope.from, $scope.to);
            }
            $scope.dateArray = lcFuncs.getDates($scope.from, $scope.to);
          })

          //Sets the intial date
          Date.prototype.addDays = function(days) {
              var date = new Date(this.valueOf())
              date.setDate(date.getDate() + days);
              return date;
          }

          $scope.dateArray = lcFuncs.getDates($scope.from, $scope.to);
          $scope.eventarray = new Array();


///////////////////////   HTTP  //////////////////////////////
          // OBTAIN THE ACCESS TOKEN!


          var pullEvents = function(iterdate){
            // $scope.loading_display = 'loadshow';
            // $scope.loading_blur = 'page_blur';
            var eventsSuccess, eventsError
            eventsSuccess = function(response){
              // var arraypush = {
              //   date: iterdate,
              //   eventinfo: response.data,}
              //   console.log(arraypush)
              // d.resolve(arraypush)
              // $scope.loading_display = '';
              // $scope.loading_blur = '';
              console.log(response)
            }
            eventsError = function(response){console.log(response)}
            lcData({token:$scope.libcaltoken, iterdate:iterdate}).pullEvents()
              .$promise.then(eventsSuccess, eventsError)
          }



          //progression here is the following (the code is read from bottom to top):
          //#1 getCreds - get the access token
          //#2 pullCats - get the categories of spaces for the location
          //#3 pullSpaces - get the spaces for all the categories

          var credsSuccess, credsError, catsSuccess,
              catsError, spacesSuccess, spacesError
          ///////this is #3///////
          spacesSuccess = function(result){
            var raw_spaces_list = new Array();
            for (var i=0; i < result.length; i++){
              raw_spaces_list = raw_spaces_list.concat(result[i].items)}//for
            $scope.spaces_dict = {};
            for (var i=0; i< raw_spaces_list.length; i++){
              var dictval = raw_spaces_list[i].id;
              $scope.spaces_dict[dictval] = raw_spaces_list[i].name}//for

              pullEvents('2017-10-10')

          }
          spacesError = function(result){console.log(result)}

          ///////this is #2///////
          catsSuccess = function(result){
            //we need a list of the category IDs, that's the goal of the following code
            var cats = result[0].categories;
            var cat_string = '';
            for (var i = 0; i < cats.length; i++){
              cat_string = cat_string.concat(cats[i].cid );
              if (i+1 < cats.length){cat_string = cat_string.concat(',');}}//for
            //now we call the space puller
            lcData({token:$scope.libcaltoken, categoryList:cat_string})
            .pullSpaces().$promise.then(spacesSuccess, spacesError);
          };//catsSuccess
          catsError = function(result){console.log(result)};

          ///////this is #1///////
          credsSuccess = function(result){
            $scope.libcaltoken = result.access_token
            lcData({token:$scope.libcaltoken}).pullCats()
            .$promise.then(catsSuccess, catsError);}
          credsError = function(result){console.log(result)}

          lcData().getCreds({
                client_id: '135',
                client_secret: '906a3eab0c7f08ebad67e5160f0ae951',
                grant_type: 'client_credentials',
          }).$promise.then(credsSuccess, credsError);










          // var getcreds = function(){
          //   var d = $q.defer();
          //   function successCallback(response) {
          //     d.resolve($scope.libcaltoken = response.data.access_token)
          //     }
          //   function errorCallback(response) {
          //       d.reject(response)
          //     }
          //   var token_url = 'https://api2.libcal.com/1.1/oauth/token'
          //   var req = {
          //         method: "POST",
          //         url: token_url,
          //         data: {
          //           client_id: '135',
          //           client_secret: '906a3eab0c7f08ebad67e5160f0ae951',
          //           grant_type: 'client_credentials',
          //         },
          //         headers: {
          //           // authorization: "JWT " + token
          //         },
          //       }//req
          //   var requestAction = $http(req).then(successCallback, errorCallback)
          //   return d.promise;
          // }//getcreds()
          // call getcreds on page load
          // PULL EVENT DATA
          // var pullevents = function(iterdate){
          //   var d = $q.defer();
          //   $scope.loading_display = 'loadshow';
          //   $scope.loading_blur = 'page_blur';
          //   function successCallback(response) {
          //       var arraypush = {
          //         date: iterdate,
          //         eventinfo: response.data,}
          //         console.log(arraypush)
          //       d.resolve(arraypush)
          //       $scope.loading_display = '';
          //       $scope.loading_blur = '';
          //     }
          //   function errorCallback(response) {console.log(response)}
          //   var endpoint = 'https://api2.libcal.com/1.1/space/bookings?lid=1598&limit=20&date=' + iterdate + '&formAnswers=1'
          //   var req = {
          //           method: "GET",
          //           url: endpoint,
          //           headers: {authorization: "Bearer " + $scope.libcaltoken},
          //         }//req
          //   var requestAction = $http(req).then(successCallback, errorCallback)
          //   return d.promise;
          // }//pullevents()


          // // PULL SPACE DATA
          // var pullcategories = function(){
          //   var d = $q.defer();
          //   function successCallback(response) {
          //     // console.log(response)
          //     var cids = response.data[0].categories;
          //     var cat_string = '';
          //     for (var i = 0; i < cids.length; i++){
          //       cat_string = cat_string.concat(cids[i].cid );
          //       if (i+1 < cids.length){
          //         cat_string = cat_string.concat(',');
          //       }
          //     }
          //     d.resolve(cat_string)
          //   }
          //   function errorCallback(error) {d.reject('total error zone baby')}
          //   //in the future, we will look up all the locations so we can obtain a full category list
          //   //however, for now we are not doing that
          //   var endpoint = 'https://api2.libcal.com/1.1/space/categories/1598'
          //   var req = {
          //           method: "GET",
          //           url: endpoint,
          //           headers: {authorization: "Bearer " + $scope.libcaltoken},
          //         }//req
          //   var requestAction = $http(req).then(successCallback, errorCallback)
          //   return d.promise;
          // }//pullcategories()
          //
          // var pullspaces = function(categoryList){
          //   var d = $q.defer();
          //   function successCallback(response) {
          //     //this is where you create the room array
          //     var raw_spaces_list = new Array();
          //     for (var i=0; i < response.data.length; i++){
          //       raw_spaces_list = raw_spaces_list.concat(response.data[i].items)
          //     }
          //     $scope.spaces_dict = {};
          //     for (var i=0; i< raw_spaces_list.length; i++){
          //       var dictval = raw_spaces_list[i].id;
          //       $scope.spaces_dict[dictval] = raw_spaces_list[i].name
          //     }
          //     d.resolve()
          //   }
          //   function errorCallback(error) {console.log(error); getcreds();}
          //   var endpoint = 'https://api2.libcal.com/1.1/space/category/' + categoryList + '?details=1'
          //   var req = {
          //           method: "GET",
          //           url: endpoint,
          //           headers: {authorization: "Bearer " + $scope.libcaltoken},
          //         }//req
          //   var requestAction = $http(req).then(successCallback, errorCallback)
          //   return d.promise;
          // }//pullspaces()
          //
          // var get_initial_data = function(categoryList){
          //   var promise = pullspaces(categoryList);
          //   promise.then(function(){
          //     $scope.get_events();
          //   }, function(failure){console.log(failure)});
          // }
          //
          // var get_room_info = function(){
          //   var promise = pullcategories();
          //   promise.then(function(categoryList){
          //     get_initial_data(categoryList);
          //   },function(failure){console.log(failure)});
          // };//get_room_info()
          //
          // var page_startup = function(){
          //   $scope.loading_display = 'loadshow';
          //   $scope.loading_blur = 'page_blur';
          //   var promise = getcreds();
          //   promise.then(function(){
          //     get_room_info();
          //   },function(){console.log(failure)}
          //   )
          // }
          // page_startup();


///////////////////////  END HTTP  //////////////////////////////


          // Get time function
          $scope.get_time = function(timestring){
            var mytime = lcFuncs.formatDate(timestring)
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
                $scope.sortedarray = lcFuncs.formatEvents(data);
              });
          }//$scope.get_events()
        }//controller

      });



        // https://api2.libcal.com/1.1/space/locations
