'use strict';

angular.module('stats')
  .directive('datepickerRow', function(){
      return {
        templateUrl: '/api/templates/stats/datepicker_row.html',
      }

  })
  .directive('statsRow', function(){
      return {
        templateUrl: '/api/templates/stats/stats_row.html',
      }
  })

  .directive('tableRow', function(){
      return {
        templateUrl: '/api/templates/stats/table_row.html',
      }
  })

  .directive('modals', function(){
      return {
        templateUrl: '/api/templates/stats/modals.html',
      }
  })
  .directive('chartRow', function(){
      return {
        templateUrl: '/api/templates/stats/chart_row.html',
      }
  })
  .directive('filterRow', function(){
      return {
        templateUrl: '/api/templates/stats/filter_row.html',
      }
  })
  .directive('bigData', function(){
      return {
        templateUrl: '/api/templates/stats/big_data.html',
      }
  });
