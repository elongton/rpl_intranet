'use strict';

angular.module('controls').
      component('controls', {
        templateUrl: '/api/templates/reference_app/controls.html',
        controller: function(Request, $scope, $cookies, $http, $rootScope, $window){

            $scope.submitsuccess = false;

            var token = $cookies.get("token")
            if (token) {
              $scope.username = $cookies.get("username")
              $scope.branch = $cookies.get("branch")
            }
            //default checkboxes
            $scope.request = {
              type_of_request: "1",
              medium: "1",
              over_five: false,
            }
            // $window.focus();
// NG-RESOURCE WAY OF DOING THINGS
            $scope.addRequest = function(){
              if (token){
                Request.create(
                    {
                      // time_length: $scope.request.time_length,
                      over_five: $scope.request.over_five,
                      type_of_request: $scope.request.type_of_request,
                      medium: $scope.request.medium,
                      comment: $scope.request.comment,
                    }, function(s_data){        //SUCCESS

                          var requesttypearray = ['Reference', 'Directional', 'Circulation']
                          var mediumarray = ['In Person', 'Phone', 'Email']
                          var postcontent = {
                              // time_length: $scope.request.time_length,
                              branch: $scope.branch,
                              user: $scope.username,
                              id: s_data.id,
                              time_length: null,
                              create_date: s_data.create_date,
                              over_five: $scope.request.over_five,
                              type_of_request: requesttypearray[$scope.request.type_of_request -1],
                              medium: mediumarray[$scope.request.medium -1],
                              comment: $scope.request.comment,
                              }
                          console.log('success!')
                          console.log(s_data)
                          document.getElementById("cbtest").checked = false;
                          $scope.request = {
                            type_of_request: "1",
                            medium: "1",
                            over_five: false,
                          }
                          //push new row to parent window

                          var statswindow = window.opener.angular.element('#stats_table').scope();
                          if ($scope.branch == statswindow.branch){
                            statswindow.data.push(postcontent)
                            statswindow.$apply();
                          }



                          $scope.fireworks = true;
                          $scope.submitsuccess = true;
                          setTimeout(function(){
                              $scope.submitsuccess = false;
                              $scope.fireworks = false;
                              $scope.$apply()
                          },5000);

                    }, function(e_data){        //ERROR
                      console.log(e_data.data)
                      $scope.requestError = e_data.data
                    })

                function successCallback(response){
                  console.log(response.data)
                }//token
                function errorCallback(response){
                  console.log(response.data)
                }//error
              } //if token
              else {
                console.log("no token")
                $scope.requestError = {login: "You need to log in."}
              } //else

            } //addRequest


            $scope.change = function(){
              var s = window.opener.angular.element('#ctrl').scope();
              s.garble="New Superhero";
              s.$apply();
            }


        }
      });






// HTTP WAY OF DOING THINGS
                // var createUrl = '/api/create/'
                // var req = {
                //               method: "POST",
                //               url: createUrl,
                //               data: {
                //                 time_length: $scope.request.time_length,
                //                 type_of_request: $scope.request.type_of_request,
                //                 medium: $scope.request.medium,
                //                 comment: $scope.request.comment,
                //               },
                //               headers: {
                //                 authorization: "JWT " + token
                //               },
                //           }//req
                //
                // var requestAction = $http(req).then(successCallback, errorCallback)
