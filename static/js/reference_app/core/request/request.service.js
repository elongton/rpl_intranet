'use strict';

angular.
  module('request').
    factory('Request', function($cookies, $location, $httpParamSerializer, $resource){
        var url = '/api/requests/'
        var requestQuery = {
              url: url,
              method: "GET",
              params: {},
              isArray: true,
              cache: true,
              transformResponse: function(data, headersGetter, status){
                var finalData = angular.fromJson(data)
                // console.log(finalData.results)
                return finalData//.results
              }
        }


        var requestDelete = {
          url: '/api/:pk/delete/',
          method: "DELETE",
          params: {"pk": '@pk'},
        }

        var requestGet = {
              url: url,
              method: "GET",
              // params: {"id": @id},
              isArray: true,
              cache: true,
        }

        var requestCreate = {
              url: '/api/requests/create/',
              method: "POST",
              interceptor: {responseError: function(response){
                if (response.status == 401){
                  console.log("you need to log in.")
                }
              }},
              transformResponse: function(data, headersGetter, status){
                var data = angular.fromJson(data)
                // console.log(data)
                return data//.results
              }

        }

        var token = $cookies.get("token")
        if (token) {
          requestCreate["headers"] = {"Authorization": "JWT " + token}
          requestDelete["headers"] = {"Authorization": "JWT " + token}
        }

        return $resource(url, {}, {
            query: requestQuery,
            get: requestGet,
            create: requestCreate,
            delete: requestDelete,
        })
    });
