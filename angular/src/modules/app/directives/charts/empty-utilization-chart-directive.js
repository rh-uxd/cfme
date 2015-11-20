angular.module('miq.charts').directive('emptyUtilizationChart', function() {
  'use strict';
  return {
    restrict: 'A',
    scope: {
      title: '@'
    },
    templateUrl: 'modules/app/directives/charts/empty-utilization-chart.html'
  }
});
