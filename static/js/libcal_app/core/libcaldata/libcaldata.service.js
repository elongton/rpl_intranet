'use strict';

angular.
  module('libcaldata').
    factory('LibCalData', function($cookies, $location, $httpParamSerializer, $resource){
        var url = 'https://api2.libcal.com/1.1/oauth/token'
        var getCreds = {
              url: url,
              method: "POST",
        }

        // var requestDelete = {
        //   url: '/api/reference/:pk/delete/',
        //   method: "DELETE",
        //   params: {"pk": '@pk'},
        // }
        //
        // var requestGet = {
        //       url: url,
        //       method: "GET",
        //       // params: {"id": @id},
        //       isArray: true,
        //       cache: true,
        // }
        //
        // var requestCreate = {
        //       url: '/api/reference/requests/create/',
        //       method: "POST",
        //       interceptor: {responseError: function(response){
        //         if (response.status == 401){
        //           console.log("you need to log in.")
        //         }
        //       }},
        //       transformResponse: function(data, headersGetter, status){
        //         var data = angular.fromJson(data)
        //         // console.log(data)
        //         return data//.results
        //       }
        //
        // }
        //
        // var token = $cookies.get("token")
        // if (token) {
        //   requestCreate["headers"] = {"Authorization": "JWT " + token}
        //   requestDelete["headers"] = {"Authorization": "JWT " + token}
        // }

        return $resource(url, {}, {
            getCreds: getCreds,
            // get: requestGet,
            // create: requestCreate,
            // delete: requestDelete,
        })
    });
