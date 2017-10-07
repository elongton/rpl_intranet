'use strict';

angular.module('stats')
  .directive('datepickerRow', function(){
      return {
        templateUrl: '/api/templates/reference_app/stats/datepicker_row.html',
      }

  })
  .directive('statsRow', function(){
      return {
        templateUrl: '/api/templates/reference_app/stats/stats_row.html',
      }
  })

  .directive('tableRow', function(){
      return {
        templateUrl: '/api/templates/reference_app/stats/table_row.html',
      }
  })

  .directive('modals', function(){
      return {
        templateUrl: '/api/templates/reference_app/stats/modals.html',
      }
  })
  .directive('chartRow', function(){
      return {
        templateUrl: '/api/templates/reference_app/stats/chart_row.html',
      }
  })
  .directive('filterRow', function(){
      return {
        templateUrl: '/api/templates/reference_app/stats/filter_row.html',
      }
  })
  .directive('bigData', function(){
      return {
        templateUrl: '/api/templates/reference_app/stats/big_data.html',
      }
  });
