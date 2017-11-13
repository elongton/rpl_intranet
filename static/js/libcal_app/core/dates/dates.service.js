'use strict';

angular.
  module('dates').
    factory('Dates', function($scope){
      return function(){
        var one_day = 1000*60*60*24;
        var makeaday = function(start, end){
          start.setHours(0,0,0,0);
          end.setHours(23,59,59,999);
        }
        $scope.todaybutton = function(){
          $scope.from= new Date();
          $scope.to = new Date();
          makeaday($scope.from, $scope.to);
        }
        //run today button on reload
        $scope.todaybutton();

        //managing the datepicker
        $scope.weekbutton = function(){
          $scope.to = new Date();
          $scope.from = new Date();
          var week = $scope.to.getDate() + 7;
          $scope.to.setDate(week);
        }

        $scope.add_day_button = function(){
          var dummy_date = new Date();
          dummy_date.setMonth($scope.from.getMonth())
          dummy_date.setDate($scope.from.getDate() + 1)
          $scope.from = new Date(dummy_date);
          $scope.to = $scope.from;
        }

        $scope.lose_day_button = function(){
          var dummy_date = new Date();
          dummy_date.setDate($scope.to.getDate() - 1)
          dummy_date.setMonth($scope.to.getMonth())
          $scope.to = dummy_date;
          $scope.from = $scope.to;
        }

        $scope.add_week_button = function(){
          var dummy_date = new Date();
          dummy_date.setDate($scope.from.getDate() + 7)
          $scope.from = dummy_date;
          $scope.to = $scope.from;
        }

        $scope.$watch('from', function(){
          var total_days = Math.round(($scope.to.getTime() - $scope.from.getTime())/one_day);
          if ($scope.from > $scope.to){
            $scope.to = new Date($scope.from.getTime())
            makeaday($scope.from, $scope.to);
          }
          $scope.dateArray = getDates($scope.from, $scope.to);
        })

        $scope.$watch('to', function(){
          var total_days = Math.round(($scope.to.getTime() - $scope.from.getTime())/one_day);
          if ($scope.to < $scope.from){
            $scope.from = new Date($scope.to.getTime())
            makeaday($scope.from, $scope.to);
          }
          $scope.dateArray = getDates($scope.from, $scope.to);
        })

        //Sets the intial date
        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf())
            date.setDate(date.getDate() + days);
            return date;
        }

        function getDates(startDate, stopDate) {
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
        $scope.dateArray = getDates($scope.from, $scope.to);
        $scope.eventarray = new Array();
      }


    });
