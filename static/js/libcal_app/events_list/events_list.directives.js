'use strict';

angular.module('events')
    .directive('ngPrint', function(){
        var printSection = document.getElementById('printSection');
        // if there is no printing section, create one
        if (!printSection) {
            printSection = document.createElement('div');
            printSection.id = 'printSection';
            document.body.appendChild(printSection);
        }
        function link(scope, element, attrs) {
            element.on('click', function () {
                var elemToPrint = document.getElementById(attrs.printElementId);
                if (elemToPrint) {
                    window.onafterprint()
                    printElement(elemToPrint);
                    window.print();
                }
            });
            window.onafterprint = function () {
                // clean the print section before adding new content
                printSection.innerHTML = '';
            }
        }
        function printElement(elem) {
            // clones the element you want to print
            var domClone = elem.cloneNode(true);
            printSection.appendChild(domClone);
        }
        return {
            link: link,
            restrict: 'A'
        };
  })
  .directive('rplLogo', function(){
      return {
      templateUrl: '/api/templates/libcal_app/rpl_logo.html',
      replace:true,
      }
  })
  .directive('navBar', function(){
      return {
      templateUrl: '/api/templates/libcal_app/libcal_menu.html',
      }
  })
