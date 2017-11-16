'use strict';

angular.
  module('lcdata').
    factory('lcData', function($cookies, $location, $httpParamSerializer, $resource){
      return function({token = null,
                      iterdate = null,
                      categoryList = null} = {}){
        var getCreds = {
              url: 'https://api2.libcal.com/1.1/oauth/token',
              method: "POST",
        }//get_creds

        var pullcategories = {
              url: 'https://api2.libcal.com/1.1/space/categories/1598',
              method: 'GET',
              isArray: true,
              headers: {authorization: "Bearer " + token},
              transformResponse: function(data, headersGetter, status){
                var finalData = angular.fromJson(data)
                // console.log(finalData.results)
                return finalData//.results
              },
        }//pullcategories

        var pullspaces = {
            url: 'https://api2.libcal.com/1.1/space/category/' + categoryList + '?details=1',
            method: "GET",
            isArray: true,
            headers: {authorization: "Bearer " + token},
            transformResponse: function(data, headersGetter, status){
              var finalData = angular.fromJson(data)
              // console.log(finalData.results)
              return finalData//.results
            },
        }

        var pullevents = {
            url: 'https://api2.libcal.com/1.1/space/bookings?lid=1598&limit=20&date=' + iterdate + '&formAnswers=1',
            method: "GET",
            headers: {authorization: "Bearer " + token},
            transformResponse: function(data, headersGetter, status){
              var finalData = angular.fromJson(data)
              // console.log(finalData.results)
              return finalData//.results
            },
        }//pullevents

       return $resource(null, {}, {
              getCreds: getCreds,
              pullCats: pullcategories,
              pullSpaces: pullspaces,
              pullEvents: pullevents,
              // create: requestCreate,
              // delete: requestDelete,
          })//$resource
      }//function
    });
