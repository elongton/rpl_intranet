'use strict';

angular.module('events').
      component('eventsList', {
        templateUrl: '/api/templates/libcal_app/events_list.html',
        controller: function(lcFuncs, lcData, $scope, $cookies, $location, $http, $rootScope, $q, $window, $document, $interval, $filter){


//////////////     app initialization   //////////////

          $scope.staticfiles = staticfiles;
          $scope.calendar_option_selected = ($cookies.get("calendar_preference") == 'calendar')
          $scope.calendartoggleswitch = !($cookies.get("calendar_condensed_view") == 'true')
          if ($scope.calendar_option_selected){
            $scope.spaces_option_selected = false
          }else{
            $scope.spaces_option_selected = true
          }
          $scope.startup = true
          $scope.bchange == false
          if ($scope.calendar_option_selected){
            $scope.mobile_header = "Calendar"
          } else {
            $scope.mobile_header = "Spaces"
          }


          $scope.clicked = function(){
            $scope.calendartoggleswitch = !$scope.calendartoggleswitch;
          }

          //main branch study room filter
          $scope.main_study_rooms = false
          $scope.filter_study_rooms = function(){
            $scope.main_study_rooms = !$scope.main_study_rooms
            if ($scope.main_study_rooms){
              $scope.categoryfilter = function(detail){
                return detail.cid !== 2710}
              }else{$scope.categoryfilter = ''}
          }
          $scope.filter_study_rooms();
          //had to add this b/c page was starting up with black logos and grey buttons
          if ($scope.calendar_option_selected){
            $scope.button_color = 'btn-s1';
            $scope.option2_color = 'btn-secondary';
            $scope.option1_color = 'options-s1';
            $scope.logo_color = '#006599';
          } else if ($scope.spaces_option_selected){
            $scope.button_color = 'btn-s2';
            $scope.option2_color = 'options-s2';
            $scope.option1_color = 'btn-secondary';
            $scope.logo_color = '#cc6600';//'#ef6c00';
          }

          //mobile header mode picker
          $scope.mobile_mode_toggle = function(){
            if ($scope.calendar_option_selected){
              $scope.spaces_option();
            } else {
              $scope.calendar_option();
            }
          }


          //creating the add_event_to_textfile
          $scope.text_writeout = ''
          $scope.textfile_array = [];

          $scope.add_event_to_textfile = function(event_item){
            if (event_item.checked){
              $scope.textfile_array.push(event_item)
              console.log($scope.textfile_array)
            }else{
              var index = $scope.textfile_array.indexOf(event_item)
              if (index > -1) {$scope.textfile_array.splice(index, 1);}
              console.log($scope.textfile_array)
            }
          }

          $scope.write_text_file = function(){
            lcFuncs.makeEventsFile($scope.textfile_array, $scope.set_from, $scope.set_to);
          }

          //sorting
          $scope.sortType = 'start';
          $scope.sortReverse = false;

          function addAlert(){
            var button = angular.element( document.querySelector( '#get_events_button' ) );
            if ($scope.calendar_option_selected){
              $scope.submit_needed = 'submit_blue'
              button.addClass('button_blue');
            }else if ($scope.spaces_option_selected){
              $scope.submit_needed = 'submit_red'
              button.addClass('button_red');
            }

          }
          function removeAlert(){
            $scope.set_from = $scope.from;
            $scope.set_to = $scope.to;
            $scope.submit_needed = ''
            var button = angular.element( document.querySelector( '#get_events_button' ) );
            button.removeClass('button_red');
            button.removeClass('button_blue');
          }


          //modals
          $scope.assign_calevent_modal = function(event){
            $scope.calevent_modal = {
              allday: event.allday,
              calendar: event.calendar,
              category: event.category,
              color: event.color,
              description: event.description,
              end: event.end,
              end_time: event.end_time,
              featured_image: event.featured_image,
              future_dates: event.future_dates,
              id: event.id,
              location: event.location,
              owner: event.owner,
              presenter: event.presenter,
              registration: event.registration,
              seats: event.seats,
              start: event.start,
              start_time: event.start_time,
              title: event.title,
              url: event.url,
            }
          }

///////////////////////   MOBILE  //////////////////////////////
          //animating the buttons in mobile:
          var downanimation = function(){
            $scope.dates_button_class = 'animate_date_button_up';
            $scope.menu_button_class = 'animate_menu_button_up';
            $scope.menu_position = !$scope.menu_position
          }
          var upanimation = function(){
              $scope.dates_button_class = 'animate_date_button_down';
              $scope.menu_button_class = 'animate_menu_button_down';
              $scope.menu_position = !$scope.menu_position
          }//addanimation()
          //actual menu
          $scope.branch_menu_is_shown = 'nodisplay';
          $scope.date_menu_is_shown = 'nodisplay';
          $scope.showbranchmenu = function(){$scope.branch_menu_is_shown = ''; $scope.is_shown = ''; $scope.date_menu_is_shown = 'nodisplay'; $scope.dates_button_class = 'nodisplay';}
          $scope.showdatemenu = function(){$scope.date_menu_is_shown = ''; $scope.is_shown = ''; $scope.dates_button_class = 'nodisplay';}
          $scope.hidemenu = function(){$scope.branch_menu_is_shown = 'nodisplay'; $scope.date_menu_is_shown = 'nodisplay'; $scope.is_shown = 'nodisplay'; $scope.dates_button_class = '';}
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
                      if($scope.scrollheight > 100){upanimation();}
                  }else{
                      $scope.direction = "up";
                      if((document.documentElement.scrollHeight - ($scope.scrollheight + window.innerHeight)) > 100){downanimation();}
                  }//else
                  $scope.lastScrollTop = $scope.st;
              }//if $scope.didScroll
          }, 500);//$interval

////////////////////// END MOBILE  //////////////////////////////

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

            //add the set date for comparisons
            if($scope.startup){
              $scope.set_from = $scope.from;
              $scope.set_to = $scope.to;
            }//if
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
            //highlight changed field
            if($scope.from != $scope.set_from){
              addAlert();
            }//if
          })

          $scope.$watch('to', function(){
            var total_days = Math.round(($scope.to.getTime() - $scope.from.getTime())/one_day);
            if ($scope.to < $scope.from){
              $scope.from = new Date($scope.to.getTime())
              makeaday($scope.from, $scope.to);
            }
            $scope.dateArray = lcFuncs.getDates($scope.from, $scope.to);
            //highlight changed field
            if($scope.to != $scope.set_to){
              addAlert();
            }//if
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



///////////////////////  SPACES HTTP  //////////////////////////////

          // GET EVENTS BUTTON -- this is either calendar or spaces, depending on setting
          $scope.start_event_loop = function(){
            // console.log($scope.lbid)
            $scope.textfile_array = [];//set textfile_array (condensed view save function) to empty
            if($scope.spaces_option_selected){
              var funcArray = new Array();
              for (var i = 0; i < $scope.dateArray.length; i++ ){
                funcArray.push(getEvents($scope.dateArray[i]));
              }
              $q.all(funcArray)
              .then(function(data){
                $scope.sortedarray = lcFuncs.formatEvents(data);
                //add the set date for comparisons
                removeAlert()
              });
            }else if($scope.calendar_option_selected){
              $scope.loading_display = 'loadshow';
              $scope.loading_blur = 'page_blur';
              var calFromDate = lcFuncs.getDates($scope.from, $scope.from);
              lcData({token:$cookies.get("libcal_token")}).pullCalEvents(
              {calendar_id:$scope.lcalid,start_date:calFromDate[0],
               days:lcFuncs.getDaysBetween($scope.from,$scope.to)})
              .$promise.then(calSuccess, calError);
            }

          }//$scope.start_event_loop()


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
            lcData({token:$cookies.get("libcal_token"), iterdate:iterdate}).pullEvents({location_id:$scope.lbid})//$scope.libcaltoken
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
            $scope.start_event_loop();
          }//spacesSuccess
          spacesError = function(result){
            console.log('spacesError error'); console.log(result)
            $scope.renewtoken = true
            lcFuncs.tokenExpired(result, lcData().getRequestCreds({q:'springshare'}), requestCredsSuccess, requestCredsError)
          }

          ///////this is #2///////
          catsSuccess = function(result){
            //we need a list of the category IDs, that's the goal of the following code
            $scope.data_not_available = false
            var cats = result[0].categories;
            var cat_string = '';
            try{
              for (var i = 0; i < cats.length; i++){
                cat_string = cat_string.concat(cats[i].cid );
                if (i+1 < cats.length){cat_string = cat_string.concat(',');}}//for
              //now we call the space puller
              lcData({token:$cookies.get("libcal_token"), categoryList:cat_string})
              .pullSpaces().$promise.then(spacesSuccess, spacesError);
            }catch(err){
              $scope.data_not_available = true
              $scope.message = "There are no accessible categories at this branch."
              console.log($scope.message)
            }
          };//catsSuccess
          catsError = function(result){
            console.log('Cats error'); console.log(result)
            $scope.renewtoken = true
            lcFuncs.tokenExpired(result, lcData().getRequestCreds({q:'springshare'}), requestCredsSuccess, requestCredsError)
          };

          ///////this is #1///////
          credsSuccess = function(result){
            $cookies.put("libcal_token", result.access_token)
            lcData({token:$cookies.get("libcal_token")}).pullCats({location_id:$scope.lbid})
            .$promise.then(catsSuccess, catsError);


          }
          credsError = function(result){console.log('Creds error'); console.log(result)}

          ///////this is #0///////
          requestCredsSuccess = function(result){
            if ($scope.renewtoken == false){
            // if spaces option is selected
              if ($scope.spaces_option_selected){
                console.log('spaces selected')
                $scope.spaces_option()
              }
            // else if calendar_id option is selected
              else if($scope.calendar_option_selected){
                console.log('calendar selected')
                // lcData({token:$cookies.get("libcal_token")}).pullCalEvents({calendar_id:$scope.lcalid,start_date:'2017-11-15'})
                // .$promise.then(calSuccess, calError);
                $scope.calendar_option()
              }

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

          //get libcal branch mapping information
          var branchSuccess = function(response){
            var branchinfo = lcFuncs.setupBranches(response, $cookies.get('branch'))
            $scope.branch = branchinfo[0]
            $scope.lbid = branchinfo[1]
            $scope.lcalid = branchinfo[2]
            $scope.mapping = branchinfo[3]

            //mobile menu dropdown model assignment
            $scope.branch_menu_location = $scope.mapping[$scope.branch]
            // console.log($scope.lbid)
            lcData().getRequestCreds({q:'springshare'}).$promise.then(requestCredsSuccess, requestCredsError)


          }
          var branchError = function(response){console.log(response)}
          lcData().getBranchMapping().$promise.then(branchSuccess, branchError);

///////////////////////  END SPACES HTTP  ////////////////////////////
/////////////////////////////////////////////////////////////////////

          //function to count how many unique events exist
          $scope.unique_count = function(condensed_calendar_array){
            var holding_array = [];
            for (var i = 0; i < condensed_calendar_array.length; i++ ){
              var unique = true;
                for (var j=0; j < holding_array.length; j++){
                  if (condensed_calendar_array[i].title == holding_array[j].title){
                    unique = false;
                  }//if
                }//for j
                if (unique == true){
                  holding_array.push(condensed_calendar_array[i]);
                }//if unique
            }//for i
            return holding_array.length
          }//unique_count

///////////////////////  CALENDAR OPTION PROCESSING  //////////////////////////////

          var calSuccess, calError
          calSuccess = function(response){
            var data = response.events;
            var calprocessed_data = lcFuncs.processCalData(data)
            $scope.calendar_array = calprocessed_data.caldata
            $scope.condensed_calendar_array = calprocessed_data.caldatacondensed;
            console.log($scope.condensed_calendar_array)
            // console.log($scope.calendar_array)
            $scope.loading_display = '';
            $scope.loading_blur = '';
            //add the set date for comparisons
            removeAlert()
          }//callSuccess
          calError = function(response){
            console.log('cal events error');
            $scope.renewtoken = true
            lcFuncs.tokenExpired(response, lcData().getRequestCreds({q:'springshare'}), requestCredsSuccess, requestCredsError)
          }


///////////////////////  END CALENDAR HTTP  //////////////////////////


          //changing branch dropdown
          $scope.changebranch = function(branch){
            $scope.textfile_array = [];//set textfile_array (condensed view save function) to empty
            $scope.branch = branch
            var newbranch = branch
            $scope.lbid = $scope.mapping[branch].lbid
            $scope.lcalid = $scope.mapping[branch].lcalid
            $scope.message = ''
            $scope.bchange = true
            // lcData({token:$cookies.get("libcal_token")}).pullCats({location_id:$scope.lbid})
            // .$promise.then(catsSuccess, catsError);
            lcData().getRequestCreds({q:'springshare'}).$promise.then(requestCredsSuccess, requestCredsError)
          }//$scope.changebranch


          //calendar and spaces options
          $scope.calendar_option = function(){
            if ($scope.calendar_option_selected==false || $scope.startup == true || $scope.bchange == true){
              $scope.button_color = 'btn-s1';
              $scope.option2_color = 'btn-secondary';
              $scope.option1_color = 'options-s1';
              $scope.logo_color = '#006599';
              $scope.calendar_option_selected = true;
              $scope.spaces_option_selected = false;
              $scope.mobile_header = "Calendar"
              $scope.startup = false
              $scope.bchange = false
              $scope.loading_display = 'loadshow';
              $scope.loading_blur = 'page_blur';
              var calFromDate = lcFuncs.getDates($scope.from, $scope.from);
              lcData({token:$cookies.get("libcal_token")}).pullCalEvents(
              {calendar_id:$scope.lcalid,start_date:calFromDate[0],
               days:lcFuncs.getDaysBetween($scope.from,$scope.to)})
              .$promise.then(calSuccess, calError);
            }
          }//$scope.calendar_option()

          $scope.spaces_option = function(){
            if ($scope.spaces_option_selected==false || $scope.startup == true || $scope.bchange == true){
              $scope.button_color = 'btn-s2';
              $scope.option2_color = 'options-s2';
              $scope.option1_color = 'btn-secondary';
              $scope.logo_color = '#cc6600';//'#ef6c00';
              $scope.calendar_option_selected = false;
              $scope.spaces_option_selected = true;
              $scope.startup = false
              $scope.bchange = false
              $scope.mobile_header = "Spaces"
              // lcData().getRequestCreds({q:'springshare'}).$promise.then(requestCredsSuccess, requestCredsError)
              lcData({token:$cookies.get("libcal_token")}).pullCats({location_id:$scope.lbid})
              .$promise.then(catsSuccess, catsError);
            }//if statement

          }//$scope.spaces_option()




        }//controller

      });
