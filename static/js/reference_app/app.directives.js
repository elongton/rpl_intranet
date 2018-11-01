'use strict';

angular.module('referenceApp')
  .directive('infopage', function(){
      return {
        templateUrl: '/api/templates/reference_app/info.html',
      }

  })
  .directive('navBar', function(){
      return {
      templateUrl: '/api/templates/reference_app/reference_menu.html',
      }
  })
  .directive('maintenance', function(){
      return {
      templateUrl: '/api/templates/reference_app/maintenance.html',
      }
  })
