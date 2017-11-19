'use strict';

angular.
  module('user').
    factory('User', function($cookies, $location, $httpParamSerializer, $resource){
        var url = '/api/users/'
        var userQuery = {
              url: url,
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
        // var userGet = {
        //       url: url,
        //       method: "GET",
        //       // params: {"id": @id},
        //       isArray: true,
        //       cache: true,
        // }

        // var token = $cookies.get("token")
        // if (token) {
        //   userQuery["headers"] = {"Authorization": "JWT " + token}
        // }

        return $resource(url, {}, {
            query: userQuery,
            // get: userGet,
            // create: userCreate,
        })
    });
