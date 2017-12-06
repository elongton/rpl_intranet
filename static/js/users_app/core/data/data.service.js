'use strict';

angular.
  module('data').
    factory('Data', function($cookies, $location, $httpParamSerializer, $resource){

        var geturls = {
          url: '/api/users/urls/',
          method: "GET",
          params: {},
          isArray: true,
          cache: false,
          transformResponse: function(data, headersGetter, status){
            var finalData = angular.fromJson(data)
            // console.log(finalData.results)
            return finalData//.results
          }
        }//userQuery


        var token = $cookies.get("token")
        if (token) {
          geturls["headers"] = {"Authorization": "JWT " + token}
        }

        return $resource(null, {}, {
            getUrls: geturls,
        })
    });
