'use strict';

angular.module('tileview').
      component('tileView', {
        templateUrl: '/api/templates/tileview_app/spaces_tileview.html',
        controller: function(lcFuncs, lcData, tvFuncs, $scope, $cookies, $location, $http, $rootScope, $q, $window, $document, $interval, $filter){

          $scope.thisMonday = tvFuncs.getMonday(new Date()); // Mon Nov 08 2010
          $scope.thisSunday = tvFuncs.getSunday(new Date()); // Mon Nov 08 2010
          //Filters out the study rooms within template
          $scope.categoryfilter = function(detail){return detail.cid !== 2710}
          $scope.cancelledfilter = function(detail){
            return detail.status !== 'Cancelled by Admin';
          }
          $scope.get_room_key = function(eid){return $scope.spaces_dict[eid]}
          $scope.get_time = function(timestring){
            var mytime = lcFuncs.formatDate(timestring)
            return mytime
          }
          //creates or updates the django database record of setupcomplete for the bookID
          $scope.tilesetupcomplete = function(bookId, date){return tvFuncs.setupComplete(this.bookID, this.date)}
          //determines whether setup is required based on the detail.q1906 property
          $scope.setupcompleteclass = function(detail){return tvFuncs.setupCompleteClass(this.detail)}



          $scope.start_event_loop = function(){
              var funcArray = new Array();
              for (var i = 0; i < $scope.dateArray.length; i++ ){
                funcArray.push(getEvents($scope.dateArray[i]));
              }
              $q.all(funcArray)
              .then(function(data){
                $scope.sortedarray = lcFuncs.formatEvents(data);
              });
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
              // output data console log the data, this is what you want to uncomment
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
              console.log($scope.spaces_dict)
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
              // console.log(cats)
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
              $scope.dateArray = lcFuncs.getDates(tvFuncs.getDay(0), tvFuncs.getDay(1));
              lcData({token:$cookies.get("libcal_token")}).pullCats({location_id:$scope.lbid})
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















        }//controller

      });
