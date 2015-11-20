angular.module('miq.charts').directive('emptyTrendsChart', function() {
  'use strict';
  return {
    restrict: 'A',
    scope: {
      chartHeight: '@'
    },
    templateUrl: 'modules/app/directives/charts/empty-trends-chart.html'
  }
});
