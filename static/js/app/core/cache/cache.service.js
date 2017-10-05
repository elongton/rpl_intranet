'use strict';

angular.
  module('cache')
    .factory('Cache', function ($cacheFactory) {
      var $httpDefaultCache = $cacheFactory.get('$http');

      return {
          invalidate: function (key) {
              $httpDefaultCache.remove(key);
          }
      }
  });
