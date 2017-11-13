'use strict';

angular.
  module('dates').
    factory('getDates', function(){
      return function(startDate, stopDate){
            var dateArray = new Array();
            var currentDate = startDate;
            while (currentDate <= stopDate) {
                var dd = currentDate.getDate();
                var mm = currentDate.getMonth()+1; //January is 0!
                var yyyy = currentDate.getFullYear();
                if(dd<10) {dd = '0'+dd}
                if(mm<10) {mm = '0'+mm}
                dateArray.push(yyyy + '-' + mm + '-' + dd);
                currentDate = currentDate.addDays(1);
            }
            return dateArray;
        }

    });
