'use strict';

angular.module('stats').
      component('stats', {
        templateUrl: '/api/templates/reference_app/stats.html',
        controller: function(Request, Cache, BigData, $scope, $rootScope, $timeout, $cookies, $window, $filter, $location, $http){


          //menu
          $scope.opencontrols = function(){$scope.controlswindow = $window.open("/reference/controls", "controlswindow", "width=300, height=530");};
          $scope.navinfopage = function(){$location.url('/reference/info')}

          //app initialization
          $scope.branch = $cookies.get("branch")
          $scope.username = $cookies.get("username")
          $scope.csvbranch = $scope.branch
          $scope.datedisable = false
          $scope.staticfiles = staticfiles;
          $scope.showdata = true;
          $scope.showchartdata = true;


          //for calculating how many days in an interval (converts from milliseconds)
          var one_day = 1000*60*60*24;
          //set the period of time for which data will load initially
          // $scope.period_date = new Date();
          // $scope.period_date.setHours(0,0,0,0)
          // var period = $scope.period_date.getDate();
          // $scope.period_date.setDate(period);

          //add a delay for pagination controls to show to avoid error
          $scope.showpagination = false;
          $scope.load_pagination = function(){
            setTimeout(function(){
              $scope.showpagination = true;
              $scope.$apply()
            },200)
          }

          var makeaday = function(start, end){
            start.setHours(0,0,0,0);
            end.setHours(23,59,59,999);
          }

          var twodigit = function(number){
            var formattedNumber = ("0" + number).slice(-2);
            return formattedNumber
          }

          $scope.todaybutton = function(){
            $scope.from= new Date();
            $scope.to = new Date();
            makeaday($scope.from, $scope.to);
          }
          //run today button on reload
          $scope.todaybutton();
          var createtextdate = function(date){
            var ready_date = String(date.getFullYear()) + "-" + String(twodigit(date.getMonth()+1)) + "-" + String(twodigit(date.getDate()))
            return(ready_date)
          }

          $scope.changeBranch = function(location){
            $scope.branch = location
            $scope.csvbranch = location
            var total_days = Math.round(($scope.to.getTime() - $scope.from.getTime())/one_day);
            if (total_days > 8){
              $scope.disable_load = true;
              $scope.showdata = false;
              $scope.showchartdata = false;
              $scope.retrieve_bigdata($scope.branch.replace(' ', '+'), $scope.from, $scope.to)
            }else{
              $scope.showdata = true;
              $scope.showchartdata = true;
              $scope.disable_load = false;
              $scope.reload($scope.branch, $scope.from, $scope.to);
            }


          } //changeBranch
          $scope.csvSelectBranch = function(location){
            $scope.csvbranch = location
          } //changeBranch
          $scope.data = [];

          $scope.reload = function(branch, fromdate, todate, invalidate){
            var from_date, to_date
            $scope.datedisable = true;
            $scope.loading = true;
            $scope.loading_class = 'table_blur';
            // if (branch == "All Branches"){
            //   branch = ""
            // }

            from_date = createtextdate(fromdate)
            to_date = createtextdate(todate)

            if (invalidate){
              Cache.invalidate('/api/requests/?d1=' + from_date + '&d2=' + to_date + '&q=' + branch.replace(' ', '+'));
            }

            Request.query({q:branch, d1:from_date, d2:to_date}).$promise.then(
                    function(result){
                        $scope.loading = false;
                        $scope.datedisable = false;
                        $scope.loading_class = '';
                        $scope.data = result;
                    },
                    function(error){
                      console.log(error)
                      $scope.loading = false;
                      $scope.datedisable = false;
                    });
          }

          $scope.reload($scope.branch, $scope.from, $scope.to);
          //delete request
          //also refreshes the cache
          $scope.delete_request = function(requestid, index){
            $scope.data.splice(index, 1)
            Request.delete({pk: requestid})
            Cache.invalidate('/api/requests/?q=' + $scope.branch.replace(' ', '+'));
          }
          // modals
          $scope.assign_comment_modal = function(x){
            $scope.comment_modal = {
              comment: x.comment,
              request_type: x.type_of_request,
            }
          }
          $scope.assign_delete_modal = function(x){
            $scope.delete_modal = {
              request_type: x.type_of_request,
              comment: x.comment,
              date: x.create_date,
              medium: x.medium,
              over_five: x.over_five,
              id: x.id,
              index: $scope.data.indexOf(x),
            }
          }
          // sorting
          $scope.sortType = 'create_date';
          $scope.sortReverse = true;
          $scope.search = '';
          $scope.userfilter = '';
          $scope.changeuserfilter = function(value){
            $scope.userfilter = value
          }
          $scope.changemediumfilter = function(value){
            $scope.mediumfilter = value
          }
          $scope.changefivefilter = function(value){
            $scope.fivefilter = value
            if ($scope.fivefilter == 'Over Five Minutes'){
              $scope.fivefilternormal = 'true'
            }else if($scope.fivefilter == 'Under Five Minutes'){
              $scope.fivefilternormal = 'false'
            }else if($scope.fivefilter == ''){
              $scope.fivefilternormal = ''
            }

          }

          //managing the datepicker
          $scope.yesterdaybutton = function(){
            $scope.to = new Date();
            $scope.from = new Date();
            var yesterday = $scope.from.getDate() - 1;
            makeaday($scope.from, $scope.to);
            $scope.to.setDate(yesterday);
            $scope.from.setDate(yesterday);

          }
          $scope.weekbutton = function(){
            $scope.to = new Date();
            $scope.from = new Date();
            var week = $scope.from.getDate() - 7;
            makeaday($scope.from, $scope.to);
            $scope.from.setDate(week);

          }


          $scope.$watch('from', function(){
            var total_days = Math.round(($scope.to.getTime() - $scope.from.getTime())/one_day);
            if ($scope.from > $scope.to){
              $scope.to = new Date($scope.from.getTime())
              makeaday($scope.from, $scope.to);
              $scope.csvstartdate = $scope.from
              $scope.csvenddate = $scope.to
            }
            else{$scope.csvstartdate = $scope.from}
            // console.log(total_days)
            if (total_days > 8){
              $scope.showdata = false;
              $scope.showchartdata = false;
              $scope.disable_load = true;
              $scope.retrieve_bigdata($scope.branch.replace(' ', '+'), $scope.from, $scope.to)

            }else{
              $scope.showdata = true;
              $scope.showchartdata = true;
              $scope.disable_load = false;
              $scope.reload($scope.branch, $scope.from, $scope.to)
            }

          })
          $scope.$watch('to', function(){
            var total_days = Math.round(($scope.to.getTime() - $scope.from.getTime())/one_day);
            if ($scope.to < $scope.from){
              $scope.from = new Date($scope.to.getTime())
              makeaday($scope.from, $scope.to);
              $scope.csvstartdate = $scope.from
              $scope.csvenddate = $scope.to
            }
            else{$scope.csvenddate = $scope.to}

            if (total_days > 8){
              $scope.disable_load = true;
              $scope.showdata = false;
              $scope.showchartdata = false;
              $scope.retrieve_bigdata($scope.branch.replace(' ', '+'), $scope.from, $scope.to)
            }else{
              $scope.showdata = true;
              $scope.disable_load = false;
              $scope.showchartdata = true;
              $scope.reload($scope.branch, $scope.from, $scope.to)
            }
          })

          /////////CSV CREATOR DATE PICKER//////////
          $scope.csvstartdate = $scope.from
          $scope.csvenddate = $scope.to
          $scope.$watch('csvstartdate', function(){
            if ($scope.csvstartdate > $scope.csvenddate){
              $scope.csvenddate = new Date($scope.csvstartdate.getTime())
              makeaday($scope.csvstartdate, $scope.csvenddate);
            }
          })
          $scope.$watch('csvenddate', function(){
            if ($scope.csvenddate < $scope.csvstartdate){
              $scope.csvstartdate = new Date($scope.csvenddate.getTime())
              makeaday($scope.csvstartdate, $scope.csvenddate);
            }
          })
          $scope.makedates = function(){
            console.log(convertbranch($scope.csvbranch))
          }

          //GENERATE CSV FILE
          //this must be done using the $http service to avoid returning a giant char array

          var convertbranch = function(branch){
            branch = branch.replace(" ", "+")
            return branch
          }

          $scope.buildCSV = function(){
              $scope.loading = true;
              $http({
                method: 'GET',
                url: '/funcs/reference/csv/'+
                     createtextdate($scope.csvstartdate)+ '/'
                     + createtextdate($scope.csvenddate)+ '/'
                     + convertbranch($scope.csvbranch) + '/',
              }).then(function successCallback(response) {
                $scope.loading = false;
                  var anchor = angular.element('<a/>');
                  anchor.attr({
                      href: 'data:attachment/csv;charset=utf-8,' + encodeURI(response.data),
                      target: '_blank',
                      download: 'filename.csv'
                  })[0].click();
              }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
              });
            }//buildCSV

          $scope.retrieve_bigdatachart = function(branch, fromdate, todate){
              $scope.datedisable = true;
              $scope.showchartdata = true;
              $scope.loading = true;
              $scope.loading_class = 'table_blur';
              var from_date, to_date
              from_date = createtextdate(fromdate)
              to_date = createtextdate(todate)
            BigData.get({branch:branch, date1:from_date, date2:to_date}).$promise.then(
                    function(result){
                      $scope.loading = false;
                      $scope.datedisable = false;
                      $scope.loading_class = '';
                      $scope.bigdatachart = result

                      $scope.line_data = [
                        $scope.bigdatachart.bin9am,
                        $scope.bigdatachart.bin10am,
                        $scope.bigdatachart.bin11am,
                        $scope.bigdatachart.bin12pm,
                        $scope.bigdatachart.bin1pm,
                        $scope.bigdatachart.bin2pm,
                        $scope.bigdatachart.bin3pm,
                        $scope.bigdatachart.bin4pm,
                        $scope.bigdatachart.bin5pm,
                        $scope.bigdatachart.bin6pm,
                        $scope.bigdatachart.bin7pm,
                        $scope.bigdatachart.bin8pm,
                      ]
                    },
                    function(error){
                      console.log(error)
                    });
          }


          $scope.retrieve_bigdata = function(branch, fromdate, todate){
            $scope.datedisable = true;
            $scope.loading = true;
            $scope.loading_class = 'table_blur';
            var from_date, to_date
            from_date = createtextdate(fromdate)
            to_date = createtextdate(todate)

            BigData.query({branch:branch, date1:from_date, date2:to_date}).$promise.then(
                    function(result){
                      $scope.loading = false;
                      $scope.datedisable = false;
                      $scope.loading_class = '';
                      $scope.bigdata = result

                      $scope.total_quant = $scope.bigdata.total_quant;
                      $scope.circ_quant = $scope.bigdata.circ_quant;
                      $scope.dir_quant = $scope.bigdata.dir_quant;
                      $scope.ref_quant = $scope.bigdata.ref_quant;
                      $scope.timedata = 0;
                      $scope.percent_quant = $scope.bigdata.overfive_quant;
                      $scope.data = [];
                      $scope.plotdata = [$scope.circ_quant, $scope.dir_quant, $scope.ref_quant];
                      if ($scope.chartswitch == false){
                        $scope.chart_toggle();
                      }

                    },
                    function(error){
                      console.log(error)
                    });
          }//retrieve_bigdata




        ////////////////PLOTS////////////////
        $scope.chartswitch = false
        $scope.chart_toggle = function(){
          if($scope.showdata == false){

          }else{
            $scope.plotdata = [$scope.circ_quant, $scope.dir_quant, $scope.ref_quant];
            $scope.updatelineplot();
          }

          $scope.chartswitch = !$scope.chartswitch
          if ($scope.chartswitch){
            $scope.legend_circ = 'bluepie'
            $scope.legend_ref = 'redpie'
            $scope.legend_dir = 'greypie'
          } else {
            $scope.legend_circ = ''
            $scope.legend_ref = ''
            $scope.legend_dir = ''
          }

        }//chart_toggle


        //////// PIE CHART and STATS////////
        $scope.labels = ["Circulation", "Directional", "Reference"];
        $scope.plotdata = [1, 1, 1]
        //


          $scope.$watch(function () {
            if ($scope.showdata == false){
              // console.log($scope.bigdata)
            }else{
              $scope.total_quant = $scope.$eval("((data | timefilter:from:to) | filter:userfilter | filter:mediumfilter | filter:fivefilternormal).length");
              $scope.circ_quant = $scope.$eval("((data | timefilter:from:to) | filter:'Circulation' | filter:userfilter | filter:mediumfilter | filter:fivefilternormal).length");
              $scope.dir_quant = $scope.$eval("((data | timefilter:from:to) | filter:'Directional' | filter:userfilter | filter:mediumfilter | filter:fivefilternormal).length");
              $scope.ref_quant = $scope.$eval("((data | timefilter:from:to) | filter:'Reference' | filter:userfilter | filter:mediumfilter | filter:fivefilternormal).length");
              $scope.percent_quant = $scope.$eval("((data | overfive_filter:from:to | filter:userfilter).length / (data | timefilter:from:to | filter:userfilter).length * 100) | number:0")
              $scope.timedata = $scope.$eval("data | timefilter:from:to | filter:userfilter | filter:mediumfilter | filter:fivefilternormal");
            }

          });

        //////////////////////////////////////
        //////// LINE CHART and STATS////////
        //////////////////////////////////////
        $scope.line_labels = ["9am", "10", "11", "12pm", "1", "2", "3pm", "4", "5", "6pm", "7", "8"];
        $scope.line_series = ['# of Requests'];
        $scope.line_data = new Array(12).fill(0);
        // $scope.onClick = function (points, evt) {
        //   console.log(points, evt);
        // };
        $scope.line_datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
        $scope.line_options = {
          scales: {
            yAxes: [
              {
                id: 'y-axis-1',
                type: 'linear',
                display: true,
                position: 'left'
              },
            ]
          }
        };


        ///////////// UPDATE PLOTS ///////////////
        //this script watches for changes in the scope and starts a timer that waits scope changes propogate before updating charts.
        $scope.update_processing = false  //the scope update is not processing
        $scope.$watch('[total_quant, circ_quant, dir_quant, ref_quant]', function () {
          if ($scope.chartswitch && $scope.showdata){
                  $timeout(function () {
                    //update piechart data
                    $scope.plotdata = [$scope.circ_quant, $scope.dir_quant, $scope.ref_quant];
                    //make updating
                    $scope.updatelineplot();
                  }, 500);

            }//if scope.chartswitch
        }); //watch function



        $scope.updatelineplot = function(){
          var request
          var total_days = Math.round(($scope.to.getTime() - $scope.from.getTime())/one_day);
          $scope.line_data = new Array(12).fill(0);
          for (request in $scope.timedata){

              var stringdate = $scope.timedata[request].create_date;
              var datedate = new Date(stringdate)
              var hours = datedate.getHours()
              var minutes = datedate.getMinutes()
              var normtime = hours + minutes/60;

              if (normtime < 9.5){
                $scope.line_data[0]++
              } else if (normtime >= 9.5 && normtime < 10.5 ){
                $scope.line_data[1]++
              } else if (normtime >= 10.5 && normtime < 11.5 ){
                $scope.line_data[2]++
              } else if (normtime >= 11.5 && normtime < 12.5 ){
                $scope.line_data[3]++
              } else if (normtime >= 12.5 && normtime < 13.5 ){
                $scope.line_data[4]++
              } else if (normtime >= 13.5 && normtime < 14.5 ){
                $scope.line_data[5]++
              } else if (normtime >= 14.5 && normtime < 15.5 ){
                $scope.line_data[6]++
              } else if (normtime >= 15.5 && normtime < 16.5 ){
                $scope.line_data[7]++
              } else if (normtime >= 16.5 && normtime < 17.5 ){
                $scope.line_data[8]++
              } else if (normtime >= 17.5 && normtime < 18.5 ){
                $scope.line_data[9]++
              } else if (normtime >= 18.5 && normtime < 19.5 ){
                $scope.line_data[10]++
              } else if (normtime >= 19.5){
               $scope.line_data[11]++
             }

            }//for request in $scope.timedata
        //take average
        for (request in $scope.line_data){
          $scope.line_data[request] /= total_days;
        }


      }//update line plot function




    }//controller

    });



      // setTimeout(function(){
      //     $scope.loading = false;
      //     $scope.$apply()
      // },500);}
