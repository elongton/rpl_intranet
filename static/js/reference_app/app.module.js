'use strict';

angular.module('referenceApp', [
  //external
  'angularUtils.directives.dirPagination',
  'angularCSS',
  'ngCookies',
  'ngRoute',
  'ngResource',
  'chart.js',
  'angular-loading-bar',


  //internal
  'controls',
  'user',//for verification
  // 'login',
  'sharednav',
  'stats',

]);
