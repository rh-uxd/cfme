'use strict';
angular.module('patternfly-next.components').directive('pfTrendsChart',
  function() {
    return {
      restrict: 'A',
      scope: {
        config: '=',
        chartData: '=',
        chartHeight: '=?',
        showXAxis: '=?',
        showYAxis: '=?'
      },
      replace: true,
      templateUrl: 'patternfly-next/components/charts/trends/trends-chart.html'
    };
  }
);
