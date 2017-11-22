'use strict';

angular.
  module('lcdata').
    factory('lcData', function($resource, $cookies){
      return function({token = null,
                      iterdate = null,
                      categoryList = null,} = {}){


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

        var getCreds = {
              url: 'https://api2.libcal.com/1.1/oauth/token',
              method: "POST",
        }//get_creds

        // if (location_id){
        //   console.log('https://api2.libcal.com/1.1/space/categories/' + location_id)
        // }

        var pullcategories = {
              // url: 'https://api2.libcal.com/1.1/space/categories/' + location_id,
              url: 'https://api2.libcal.com/1.1/space/categories/1598',
              method: 'GET',
              // params: {location_id:'@location_id'},
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
            url: 'https://api2.libcal.com/1.1/space/bookings?1598&limit=100&date=' + iterdate + '&formAnswers=1',
            method: "GET",
            isArray: true,
            // params: {location_id:'@location_id'},
            headers: {authorization: "Bearer " + token},
            transformResponse: function(data, headersGetter, status){
              var finalData = angular.fromJson(data)
              return finalData//.results
            },
        }//pullevents

        //get token for querying our API for secret key
        var intranet_token = $cookies.get("token")
        if (intranet_token) {
          getrequestcreds["headers"] = {"Authorization": "JWT " + intranet_token}
          getbranchmapping["headers"] = {"Authorization": "JWT " + intranet_token}
        }


       return $resource(null, {}, {
              getBranchMapping:getbranchmapping,
              getRequestCreds:getrequestcreds,
              getCreds: getCreds,
              pullCats: pullcategories,
              pullSpaces: pullspaces,
              pullEvents: pullevents,
              // create: requestCreate,
              // delete: requestDelete,
          })//$resource
      }//function
    });
