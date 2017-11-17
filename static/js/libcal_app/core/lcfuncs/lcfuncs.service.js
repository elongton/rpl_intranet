'use strict';

angular.
  module('lcfuncs').
    factory('lcFuncs', function(){

      var getdates =  function(startDate, stopDate){
            var dateArray = new Array();
            var currentDate = startDate;
            while (currentDate <= stopDate) {
                var dd = currentDate.getDate();
                var mm = currentDate.getMonth()+1; //January is 0!
                var yyyy = currentDate.getFullYear();
                if(dd<10) {dd = '0'+dd}
                if(mm<10) {mm = '0'+mm}
                dateArray.push(yyyy + '-' + mm + '-' + dd);
                currentDate = currentDate.addDays(1);}//while
            return dateArray;
        }//getdates


      var formatdate = function(date){
            var d = new Date(date);
            var hh = d.getHours();
            var m = d.getMinutes();
            var s = d.getSeconds();
            var dd = "AM";
            var h = hh;
            if (h >= 12) {
              h = hh - 12;
              dd = "PM";
            }
            if (h == 0) {h = 12;}
            m = m < 10 ? "0" + m : m;
            s = s < 10 ? "0" + s : s;
            return h + ":" + m + " " + dd
        }



        var formatevents = function(data){
            data.sort(function(a,b){return new Date(b.date) - new Date(a.date);}).reverse();
            var monthNames = ["January", "February", "March", "April", "May", "June",
                              "July", "August", "September", "October", "November", "December"
                               ];
            var dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            for (var i=0; i < data.length; i++){
              var thedate = new Date(data[i].date);
              var datesplit = data[i].date.split("-");
              data[i].date = dayNames[thedate.getDay()] + ", " + monthNames[datesplit[1]-1] + ' ' + datesplit[2];
              data[i].eventinfo.sort(function(a,b){return new Date(b.fromDate) - new Date(a.fromDate);}).reverse();
              //lets create an array just for keys that start with 'q'
              for (var j=0; j < data[i].eventinfo.length; j++){
                var qdict = {}
                // data[i].eventinfo[j].questions = {};
                for (var key in data[i].eventinfo[j]){
                  // console.log(typeof(key))
                  if (key[0] == 'q'){
                    qdict[key] = data[i].eventinfo[j][key]
                  }//if
                }//for var key
                data[i].eventinfo[j].questions = qdict
              }//for var j=0

            }//for (var i=0; i < data.length; i++)
            return(data);
          }//formatevents




        return {
          getDates: getdates,
          formatDate: formatdate,
          formatEvents: formatevents,
        }

    });
