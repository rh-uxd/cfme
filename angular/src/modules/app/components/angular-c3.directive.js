(function(c3){
  'use strict';

angular.module('patternfly.pf-components', [])
  .directive('c3Chart', ['$timeout', function($timeout) {

    return {
      restrict: 'A',
      scope: {
        config: '='
      },
      template: '<div></div>',
      replace: true,
      link: function(scope, element, attrs) {
        //generate c3 chart data
        var chartData = scope.config;
        chartData.bindto = '#' + attrs.id;

        //Generating the chart
        $timeout(function() {
          var chart = c3.generate(chartData);
        }, 100);
      }
    };
  }]);
}(c3));