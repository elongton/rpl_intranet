'use strict';

angular.
  module('tvfuncs').
    factory('tvFuncs', function(lcData, lcFuncs){

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



      var setupcomplete = function(bookId, mydate){
        // console.log(mydate)
        // console.log(bookId)
        lcData().getSetupCompletes({s:bookId}).$promise.then(
          function(success){
            if (success.length == 0){
              lcData().createSetup({date: lcFuncs.createtextdate(new Date(mydate)), book_id: bookId, setup: 'true'}).$promise.then(
                function(success){console.log('create success!'); console.log(success)},
                function(error){ console.log('create error!'); console.log(error)}
              )
            } else {
              var setupstatus = success[0].setup == true ? false : true;
              lcData().updateSetup({id: success[0].id, setup: setupstatus}).$promise.then(
                function(success){console.log('update success!'); console.log(success)},
                function(error){ console.log('update error!'); console.log(error)}
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


      var addsetupproperties = function(setupsQuery, preSetupArray){
        if (setupsQuery.length > 0){
          for (var p = 0; p < preSetupArray.length; p++){
            for (var i = 0; i < preSetupArray[p].eventinfo.length; i++){
              for (var j = 0; j < setupsQuery.length; j++ ){
                if (preSetupArray[p].eventinfo[i].bookId == setupsQuery[j].book_id){
                  preSetupArray[p].eventinfo[i]['setup'] = setupsQuery[j].setup;
                  // console.log('pushed something')
                  // console.log($scope.sortedarray[0].eventinfo[i])
                }//if
              }//for var j
            }//for var i
          }//for var p
          return preSetupArray
        }//if setupsQuery.length
        else{
          return preSetupArray
        }
      }//function


      return {
        getMonday: getmonday,
        getSunday: getsunday,
        getDay: getday,
        setupComplete: setupcomplete,
        setupCompleteClass: setupcompleteclass,
        addSetupProperties: addsetupproperties,
      }

    });
