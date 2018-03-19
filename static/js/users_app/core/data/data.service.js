'use strict';

angular.
  module('data').
    factory('Data', function($cookies, $location, $httpParamSerializer, $resource){

        var teamupdate = {
          url: '/api/libcal/teamlist/:id/update/',
          method: 'PUT',
          params: {id:'@id'},
          interceptor: {responseError: function(response){
            if (response.status == 401){
              console.log("you need to log in.")
            }
          }},
        }


        var create_team = {
          url: '/api/libcal/teamlist/create/',
          method: 'POST',
        }


        var getsetupteams = {
          url: '/api/libcal/teamlist/',
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

        var getusers = {
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

        var getbranches = {
          url: '/api/users/branches/',
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


        var getactivations = {
          url: '/api/reference/activation/',
          method: "GET",
          // params: {"id": @id},
          isArray: true,
        }


        var createactivation = {
          url: '/api/reference/activation/create/',
          method: "POST",
          interceptor: {responseError: function(response){
            if (response.status == 401){
              console.log("you need to log in.")
            }
          }},
        }



        var token = $cookies.get("token")
        if (token) {
          geturls["headers"] = {"Authorization": "JWT " + token}
          createactivation["headers"] = {"Authorization": "JWT " + token}
        }

        return $resource(null, {}, {
            updateTeam: teamupdate,
            createTeam: create_team,
            getSetupTeams: getsetupteams,
            createActivation: createactivation,
            getActivations: getactivations,
            getUrls: geturls,
            getUsers: getusers,
            getBranches: getbranches,
        })
    });
