'use strict';

angular.
  module('bigdata').
    factory('BigData', function($cookies, $location, $httpParamSerializer, $resource){
        var url = '/api/requests/bigdata/:date1/:date2/:branch/'
        var url2 = '/api/requests/bigdatachart/:date1/:date2/:branch/'
        var dataQuery = {
              url: url,
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
          url: url2,
          method: "GET",
          params: {"date1":'@date1', "date2":'@date2',"branch":'@branch'},
          isArray: false,
          cache: true,
          transformResponse: function(data, headersGetter, status){
            var finalData = angular.fromJson(data)
            return finalData//.results
          }

        }

        return $resource(url, {}, {
            query: dataQuery,
            get: chartGet,
        })
    });
