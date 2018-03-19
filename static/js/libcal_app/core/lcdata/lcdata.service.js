'use strict';

angular.
  module('lcdata').
    factory('lcData', function($resource, $cookies){
      return function({token = null,
                      iterdate = null,
                      categoryList = null,} = {}){


        var getteamlist = {
          url: '/api/libcal/teamlist/',
          method: 'GET',
          isArray: true,
          transformResponse: function(data, headersGetter, status){
            var finalData = angular.fromJson(data)
            return finalData
          },

        }

        var tokenrefresh = {
          url: '/api/auth/api-token-refresh/',
          method: 'POST',
        }

        var getbranchmapping = {
          url: '/api/libcal/list/',
          method: "GET",
          params:{},
          isArray: true,
          transformResponse: function(data, headersGetter, status){
            var finalData = angular.fromJson(data)
            return finalData
          }
        }//getbranchmapping

        var getrequestcreds = {
          url: '/api/remoteapis/list/',
          method: "GET",
          params: {},
          isArray: true,
          transformResponse: function(data, headersGetter, status){
            var finalData = angular.fromJson(data)
            return finalData
          }
        }//getrequestcreds


        ////////////////       ////////////////
        ////////////////SPACES/////////////////
        ////////////////      /////////////////

        var getCreds = {
              url: 'https://api2.libcal.com/1.1/oauth/token',
              method: "POST",
        }//get_creds

        var pullcategories = {
              // url: 'https://api2.libcal.com/1.1/space/categories/' + location_id,
              url: 'https://api2.libcal.com/1.1/space/categories/:location_id',
              method: 'GET',
              params: {location_id:'@location_id'},
              isArray: true,
              headers: {authorization: "Bearer " + token},
              transformResponse: function(data, headersGetter, status){
                var finalData = angular.fromJson(data)
                return finalData//.results
              },
        }//pullcategories
        // pullcategories['url'] = 'https://api2.libcal.com/1.1/space/categories/' + location_id

        var pullspaces = {
            url: 'https://api2.libcal.com/1.1/space/category/' + categoryList + '?details=1',
            method: "GET",
            isArray: true,
            headers: {authorization: "Bearer " + token},
            transformResponse: function(data, headersGetter, status){
              var finalData = angular.fromJson(data)
              return finalData//.results
            },
        }

        var pullevents = {
            // url: 'https://api2.libcal.com/1.1/space/bookings?lid=' + location_id + '&limit=100&date=' + iterdate + '&formAnswers=1',
            url: 'https://api2.libcal.com/1.1/space/bookings?lid=:location_id&limit=100&date=' + iterdate + '&formAnswers=1',
            method: "GET",
            isArray: true,
            params: {location_id:'@location_id'},
            headers: {authorization: "Bearer " + token},
            transformResponse: function(data, headersGetter, status){
              var finalData = angular.fromJson(data)
              return finalData//.results
            },
        }//pullevents


        /////////////         /////////////
        /////////////CALENDARS/////////////
        /////////////         /////////////

        var pullcalevents = {
          url: 'https://api2.libcal.com/1.1/events?cal_id=:calendar_id&date=:start_date&days=:days&limit=100',
          method: "GET",
          // isArray: true,
          params: {calendar_id:'@calendar_id',
                   start_date:'@start_date',
                   days:'@days'},
          headers: {authorization: "Bearer " + token},
          transformResponse: function(data, headersGetter, status){
            var finalData = angular.fromJson(data)
            return finalData//.results
          },


        }




        //get token for querying our API for secret key
        var intranet_token = $cookies.get("token")
        if (intranet_token) {
          getrequestcreds["headers"] = {"Authorization": "JWT " + intranet_token}
          getbranchmapping["headers"] = {"Authorization": "JWT " + intranet_token}
        }


       return $resource(null, {}, {
              getTeamList: getteamlist,
              tokenRefresh:tokenrefresh,
              getBranchMapping:getbranchmapping,
              getRequestCreds:getrequestcreds,
              getCreds: getCreds,
              pullCats: pullcategories,
              pullSpaces: pullspaces,
              pullEvents: pullevents,
              pullCalEvents:pullcalevents,
              // create: requestCreate,
              // delete: requestDelete,
          })//$resource
      }//function
    });
