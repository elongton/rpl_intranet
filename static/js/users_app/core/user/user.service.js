'use strict';

angular.
  module('user').
    factory('User', function($cookies, $location, $httpParamSerializer, $resource){

        var userquery = {
          url: '/api/users/',
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
        var userlogin = {
          url: '/api/auth/token/',
          method: 'POST',
        }

        var usercreate= {
          url: '/api/users/register/',
          method: 'POST',
        }

        var userupdate = {
          url: '/api/users/:id/edit/',
          method: 'PUT',
          params: {id:'@id'},
          interceptor: {responseError: function(response){
            if (response.status == 401){
              console.log("you need to log in.")
            }
          }},
        }

        var tokenverify = {
          url: '/api/auth/api-token-verify/',
          method: 'POST',
        }
        var token = $cookies.get("token")
        if (token) {
          userupdate["headers"] = {"Authorization": "JWT " + token}
        }

        return $resource(null, {}, {
            userCreate: usercreate,
            query: userquery,
            userLogin: userlogin,
            tokenVerify: tokenverify,
            userUpdate: userupdate,
        })
    });
