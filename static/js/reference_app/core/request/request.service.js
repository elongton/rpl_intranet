'use strict';

angular.
  module('request').
    factory('Request', function($cookies, $location, $httpParamSerializer, $resource){
        var requestQuery = {
          url: '/api/reference/requests/',
          method: "GET",
          params: {},
          isArray: true,
          cache: true,
          transformResponse: function(data, headersGetter, status){
            var finalData = angular.fromJson(data)
            // console.log(finalData.results)
            return finalData//.results
          }
        }//requestquery


        var requestDelete = {
          url: '/api/reference/:pk/delete/',
          method: "DELETE",
          params: {"pk": '@pk'},
        }

        var requestGet = {
          url: '/api/reference/requests/',
          method: "GET",
          // params: {"id": @id},
          isArray: true,
          cache: true,
        }

        var requestCreate = {
          url: '/api/reference/requests/create/',
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
        }//requestCreate

        var csv_s_get = {
          url: '/funcs/reference/streamingcsvtest/',
          // url: '/api/requests/csv/:start/:end/:branch/',
          // params: {'start': '@start',
          //          'end': '@end',
          //          'branch': '@branch'},
          method: "GET",
          // transformResponse: function(data, headersGetter, status){
          //   console.log(data)
          //   console.log(status)
          //   console.log(headersGetter)
          //   return data
          // },
        }//STREAMING

        var csv_get = {
          url: '/funcs/reference/csvtest/',
          method: "GET",
          transformResponse: function(data, headersGetter, status){
              return data.toString()
            // return data.type()
          },
        }

        var token = $cookies.get("token")
        if (token) {
          requestCreate["headers"] = {"Authorization": "JWT " + token}
          requestDelete["headers"] = {"Authorization": "JWT " + token}
        }

        return $resource(null, {}, {
            csvGet: csv_get,
            csvStreamingGet: csv_s_get,
            query: requestQuery,
            get: requestGet,
            create: requestCreate,
            delete: requestDelete,
        })
    });
