'use strict';

angular.
  module('lcfuncs').
    factory('lcFuncs', function(){


      var tokenexpired = function(result, resolve_func, success, error){
        if (result.data.error_description == "The access token provided has expired"){
          resolve_func.$promise.then(success, error);
        }//if
      }//tokenexpired

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
                console.log("User account branch hasn't been mapped on our backend. Talk to your admin.")
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



        return {
          getDates: getdates,
          formatDate: formatdate,
          formatEvents: formatevents,
          disableBack: disable_back_button,
          tokenExpired: tokenexpired,
          setupBranches: setupbranches,
        }

    });
