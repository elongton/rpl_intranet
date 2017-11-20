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

          //Set restrictions on datepickers -- can't choose date before today
          var datepickertoday = new Date()
          datepickertoday.setDate(datepickertoday.getDate())
          datepickertoday = datepickertoday.toISOString().split('T')[0];
          document.getElementById('mobile_startdate').setAttribute('min', datepickertoday)
          document.getElementById('startdate').setAttribute('min', datepickertoday)
          document.getElementById('enddate').setAttribute('min', datepickertoday)

          //sets the start and end time so that the
          //start date starts at 12:00am, and the end date ends at 11:59pm
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

          $scope.add_day_button = function(){
            var dummy_date = new Date();
            dummy_date.setFullYear($scope.from.getFullYear())
            dummy_date.setMonth($scope.from.getMonth())
            dummy_date.setDate($scope.from.getDate() + 1)
            $scope.from = new Date(dummy_date);
            $scope.to = $scope.from;


          }

          $scope.lose_day_button = function(){
            var dummy_date = new Date();
            dummy_date.setFullYear($scope.to.getFullYear())
            dummy_date.setMonth($scope.to.getMonth())
            dummy_date.setDate($scope.to.getDate() - 1)
            $scope.to = dummy_date;
            $scope.from = $scope.to;
            }


          $scope.$watch('from', function(){
            var total_days = Math.round(($scope.to.getTime() - $scope.from.getTime())/one_day);
            if ($scope.from > $scope.to){
              $scope.to = new Date($scope.from.getTime())
              makeaday($scope.from, $scope.to);
            }

            $scope.dateArray = lcFuncs.getDates($scope.from, $scope.to);
            $scope.backdisable = lcFuncs.disableBack($scope.from);
            $scope.$apply

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
              funcArray.push(getEvents($scope.dateArray[i]));
            }
            $q.all(funcArray)
              .then(function(data){
                // console.log(data)
                $scope.sortedarray = lcFuncs.formatEvents(data);
              });
          }//$scope.get_events()


///////////////////////   HTTP  //////////////////////////////
          //check if there's a token. if not, get one
          if ($cookies.get("libcal_token")){$scope.renewtoken=false}else{$scope.renewtoken=true}
          // OBTAIN THE ACCESS TOKEN!
          var getEvents = function(iterdate){
            var d = $q.defer();
            $scope.loading_display = 'loadshow';
            $scope.loading_blur = 'page_blur';
            var eventsSuccess, eventsError
            eventsSuccess = function(result){
              var arraypush = {
                date: iterdate,
                eventinfo: result,}
              console.log(arraypush)
              $scope.loading_display = '';
              $scope.loading_blur = '';
              d.resolve(arraypush)
            }
            eventsError = function(result){
              console.log('events error'); console.log(result)
              $scope.renewtoken = true
              lcFuncs.tokenExpired(result, lcData().getRequestCreds({q:'springshare'}), requestCredsSuccess, requestCredsError)
            }
            lcData({token:$cookies.get("libcal_token"), iterdate:iterdate}).pullEvents()//$scope.libcaltoken
              .$promise.then(eventsSuccess, eventsError)
            //return the array
            return d.promise;
          }
          //progression here is the following (read code from bottom to top):
          //#0 getRequestCreds - ask local Django api for request creds
          //#1 getCreds - get the access token
          //#2 pullCats - get the categories of spaces for the location
          //#3 pullSpaces - get the spaces for all the categories
          var credsSuccess, credsError, catsSuccess,
              catsError, spacesSuccess, spacesError,
              requestCredsSuccess, requestCredsError
          ///////this is #3///////
          spacesSuccess = function(result){
            var raw_spaces_list = new Array();
            for (var i=0; i < result.length; i++){
              raw_spaces_list = raw_spaces_list.concat(result[i].items)}//for
            $scope.spaces_dict = {};
            for (var i=0; i< raw_spaces_list.length; i++){
              var dictval = raw_spaces_list[i].id;
              $scope.spaces_dict[dictval] = raw_spaces_list[i].name}//for
            //run get_events on startup
            $scope.get_events();
          }//spacesSuccess
          spacesError = function(result){
            console.log('spacesError error'); console.log(result)
            $scope.renewtoken = true
            lcFuncs.tokenExpired(result, lcData().getRequestCreds({q:'springshare'}), requestCredsSuccess, requestCredsError)
          }

          ///////this is #2///////
          catsSuccess = function(result){
            //we need a list of the category IDs, that's the goal of the following code
            var cats = result[0].categories;
            var cat_string = '';
            for (var i = 0; i < cats.length; i++){
              cat_string = cat_string.concat(cats[i].cid );
              if (i+1 < cats.length){cat_string = cat_string.concat(',');}}//for
            //now we call the space puller
            lcData({token:$cookies.get("libcal_token"), categoryList:cat_string})
            .pullSpaces().$promise.then(spacesSuccess, spacesError);
          };//catsSuccess
          catsError = function(result){
            console.log('Cats error'); console.log(result)
            $scope.renewtoken = true
            lcFuncs.tokenExpired(result, lcData().getRequestCreds({q:'springshare'}), requestCredsSuccess, requestCredsError)
          };

          ///////this is #1///////
          credsSuccess = function(result){
            $cookies.put("libcal_token", result.access_token)
            lcData({token:$cookies.get("libcal_token")}).pullCats()
            .$promise.then(catsSuccess, catsError);}
          credsError = function(result){console.log('Creds error'); console.log(result)}

          ///////this is #0///////
          requestCredsSuccess = function(result){
            if ($scope.renewtoken == false){
              lcData({token:$cookies.get("libcal_token")}).pullCats()
              .$promise.then(catsSuccess, catsError);
            }else{
              console.log('getting a new token')
              $scope.renewtoken = false
              lcData().getCreds({
                client_id: result[0].client_id,
                client_secret: result[0].client_secret,
                grant_type: result[0].grant_type,
              }).$promise.then(credsSuccess, credsError);
            }//ifelse statment

          }
          requestCredsError = function(result){console.log('requestCreds error'); console.log(result)}
          lcData().getRequestCreds({q:'springshare'}).$promise.then(requestCredsSuccess, requestCredsError);

///////////////////////  END HTTP  //////////////////////////////

        }//controller

      });
