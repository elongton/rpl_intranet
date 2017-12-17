'use strict';

angular.
  module('bigdata').
    factory('BigData', function($cookies, $location, $httpParamSerializer, $resource){
        var dataQuery = {
              url: '/funcs/reference/bigdata/:date1/:date2/:branch/',
              method: "GET",
              params: {"date1":'@date1', "date2":'@date2',"branch":'@branch'},
              isArray: false,
              cache: true,
              transformResponse: function(data, headersGetter, status){
                var finalData = angular.fromJson(data)
                return finalData//.results
              }
        }


        var chartGet = {
          url: '/funcs/reference/bigdatachart/:date1/:date2/:branch/',
          method: "GET",
          params: {"date1":'@date1', "date2":'@date2',"branch":'@branch'},
          isArray: false,
          cache: true,
          transformResponse: function(data, headersGetter, status){
            var finalData = angular.fromJson(data)
            return finalData//.results
          }

        }

        return $resource(null, {}, {
            query: dataQuery,
            get: chartGet,
        })
    });
