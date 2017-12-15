'use strict';

angular.
  module('lcfuncs').
    factory('lcFuncs', function(){


      var tokenexpired = function(result, resolve_func, success, error){
        if (result.data.error_description == "The access token provided has expired"){
          resolve_func.$promise.then(success, error);
        }//if
      }//tokenexpired


      var getdaysbetween = function(date1, date2){
        //Get 1 day in milliseconds
        var one_day=1000*60*60*24;
        date1.setHours(23);//set hours of date1 to 23 for rounding purposes (we won't get 2 days)
        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();
        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;
        // Convert back to days and return
        return Math.round(difference_ms/one_day);
      }


      //this function creates an array of all the dates in the range
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


          var disable_back_button = function(mydate){
            var disable_check = new Date()
            disable_check.setHours(0,0,0,0)
            mydate.setHours(0,0,0,0);
            var backdatedisable
            if (mydate.getTime() <= disable_check.getTime()){
              backdatedisable = true
            }else{backdatedisable = false}
            return backdatedisable;
          }

          var setupbranches = function(apibranchmapping, c_branch){
            //1. get the current user's branch (should be in cookies)
            //2. try and match current user's branch id with branch ids in Mapping API
            //  2a. If exists, set libcal_calendar_id and also libcal_branch_id
            //  2b. If doesn't exist, set "" and "" to default Main branch
            var branchMappingDict = {}
            var s_branch, s_lbid, s_lcalid
            for (var i=0; i < apibranchmapping.length; i++){
              branchMappingDict[apibranchmapping[i].branch] = {
                      branch: apibranchmapping[i].branch,
                      lbid: apibranchmapping[i].libcal_branch_id,
                      lcalid: apibranchmapping[i].libcal_calendar_id,
                    }
            }//for
            try {
              var mapping = branchMappingDict[c_branch]
              s_branch = mapping.branch
              s_lbid = mapping.lbid
              s_lcalid = mapping.lcalid
            }catch(err){
              if (err.name == 'TypeError'){
                console.log("User account branch hasn't been mapped on our backend. Talk to Max about this.")
              }else{console.log(err)}
              var defaultmap = branchMappingDict['Main']
              s_branch = 'Main'
              s_lbid = defaultmap.lbid
              s_lcalid = defaultmap.lcalid
              console.log(s_branch)
              console.log(s_lbid)
              console.log(s_lcalid)
            }//try catch
            var myArray = new Array(4);
            myArray[0] = s_branch
            myArray[1] = s_lbid
            myArray[2] = s_lcalid
            myArray[3] = branchMappingDict
            return myArray
          }


          var processcaldata = function(data){
              data.sort(function(a,b){return new Date(b.start) - new Date(a.start);}).reverse();
              var j = 0; //set date index to zero
              var caldata = [];
              var caldatacondensed = [];
              for (var i=0; i < data.length; i++){
                //get the date of the current item
                var itemday = new Date(data[i].start)
                var controlday = new Date(data[j].start)
                itemday.setHours(0,0,0,0)
                controlday.setHours(0,0,0,0)
                data[i].start_time = formatdate(data[i].start)
                data[i].end_time = formatdate(data[i].end)
                if (itemday > controlday || i == 0){//if the current item's date is higher than the current date
                  var j = i; //set the index of the new date to be populated
                  var datedict = {date:readable_date(itemday), eventinfo: []} //create the new dictionary item
                  datedict.eventinfo.push(data[i]) //add the data
                  caldata.push(datedict) //add the dictionary item to the array
                } else {
                  datedict.eventinfo.push(data[i])
                }//if
              }//for loop
              caldatacondensed = data;

            function readable_date(date){
              var monthNames = ["January", "February", "March", "April", "May", "June",
                                "July", "August", "September", "October", "November", "December"];
              var dayNames = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
              var monthInt = date.getMonth()
              var dayWeekInt = date.getDay()
              var dayMonthInt = date.getDate()

              var readableDate = dayNames[dayWeekInt] + ", " + monthNames[monthInt]  + " " + dayMonthInt.toString()
              return readableDate
            }//readable_date()

            var datalibrary = {
              caldata: caldata,
              caldatacondensed:caldatacondensed,
            }

            return datalibrary
          }//processcaldata


          function saveTextAsFile (data, filename){
                if(!data) {
                     console.error('Console.save: No data')
                     return;
                 }
                 if(!filename) filename = 'console.json'

                 var blob = new Blob([data], {type: 'text/plain'}),
                     e    = document.createEvent('MouseEvents'),
                     a    = document.createElement('a')
                // FOR IE:

                 if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                     window.navigator.msSaveOrOpenBlob(blob, filename);
                 }
                 else{
                     var e = document.createEvent('MouseEvents'),
                         a = document.createElement('a');

                     a.download = filename;
                     a.href = window.URL.createObjectURL(blob);
                     a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
                     e.initEvent('click', true, false, window,
                         0, 0, 0, 0, 0, false, false, false, false, 0, null);
                     a.dispatchEvent(e);
                 }
         }//saveTextAsFile

         function expFile(event_array) {
           var fileText = '';
           for (var i = 0; i < event_array.length; i++){
             fileText = fileText.concat(event_array[i].title + '\r\n'
                                      + event_array[i].start_time + ' - ' + event_array[i].end_time + '\r\n'
                                      + event_array[i].description + '\r\n' + '\r\n')
           }
           var fileName = "calevents.txt"
           saveTextAsFile(fileText, fileName);
         }


        return {
          makeEventsFile: expFile,
          getDates: getdates,
          formatDate: formatdate,
          formatEvents: formatevents,
          disableBack: disable_back_button,
          tokenExpired: tokenexpired,
          setupBranches: setupbranches,
          getDaysBetween: getdaysbetween,
          processCalData: processcaldata,
        }

    });
