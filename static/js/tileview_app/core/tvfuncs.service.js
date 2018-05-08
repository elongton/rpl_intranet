'use strict';

angular.
  module('tvfuncs').
    factory('tvFuncs', function(lcData){

      var getmonday = function(d) {
        d = new Date(d);
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
        return new Date(d.setDate(diff));
      }

      var getsunday = function(d) {
        d = new Date(d);
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6:1) + 6; // adjust when day is sunday
        return new Date(d.setDate(diff));
      }

      var getday = function(d){
        var date = new Date();
        date.setDate(date.getDate() + d)
        return date
      }



      var setupcomplete = function(bookId, date){
        lcData().getSetupCompletes({s:bookId}).$promise.then(
          function(success){
            if (success.length == 0){
              //open dialog in center
              // console.log('empty')
              lcData().createSetup({date: lcFuncs.createtextdate(new Date(date)), book_id: bookId, setup: 'true'}).$promise.then(
                function(success){console.log(success)},
                function(error){console.log(error)}
              )
            } else {
              //open dialog in center
              // console.log('filled')
              // console.log(success.length)
              //check current setup status and set to opposite
              var setupstatus = success[0].setup == true ? false : true;
              //http update setup to opposite
              lcData().updateSetup({id: success[0].id, setup: setupstatus}).$promise.then(
                function(success){console.log(success)},
                function(error){console.log(error)}
              )
            }//if else
          },
          function(error){console.log('this was an error', error)}
        )
      }


      var setupcompleteclass = function(detail){
        if(detail.q1906){
          if(detail.setup == true){
            return 'setup_complete'
          }else{
            return 'setup_required'
          }
        }
      }//setupcompleteclass



      return {
        getMonday: getmonday,
        getSunday: getsunday,
        getDay: getday,
        setupComplete: setupcomplete,
        setupCompleteClass: setupcompleteclass,
      }

    });
