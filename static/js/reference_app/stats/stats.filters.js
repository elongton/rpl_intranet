angular.module('stats').
          filter("timefilter", function(){
            return function(items, from, to) {
                  var df = from;
                  var dt = to;
                  var result = [];

                  // console.log(items)
                  for (var i=0; i < items.length; i++){
                      var date = new Date(items[i].create_date);
                      if (date > df && date < dt)  {
                          result.push(items[i]);
                      }
                  }
                  return result;
            };
          }).
          filter("overfive_filter", function(){
            return function(items, from, to){
                var df = from;
                var dt = to;
                var result = [];
                // console.log(items)
                for (var i=0; i < items.length; i++){
                    if (items[i].over_five == true){
                      var date = new Date(items[i].create_date);
                      if (date > df && date < dt)  {
                          result.push(items[i]);
                      } //if in between date
                    }// if over_five

                }
                return result;
            };
          })
