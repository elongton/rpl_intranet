'use strict';

angular.module('events')
    .filter('htmlToPlainText', function(){
      return function(text) {
        return  text ? String(text).replace(/<[^>]+>/gm, '') : '';};
    })
