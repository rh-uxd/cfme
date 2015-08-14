angular.module('cfme.charts').directive('cfmeHeatMapLegend', ['ChartsMixin', '$timeout',
  function(chartsMixin, $timeout) {
    'use strict';
    return {
      restrict: 'A',
      scope: {
        legend: '='
      },
      replace: true,
      templateUrl: 'modules/app/directives/charts/heatmap/heatmap-legend.html',
      controller: ['$scope', '$rootScope',
        function($scope, $rootScope) {
          var items = [];
          var legendColors = chartsMixin.getDefaultHeatmapColorPattern();
          if ($scope.legend) {
            for (var i = $scope.legend.length - 1; i >= 0; i--) {
              items.push({
                text: $scope.legend[i],
                color: legendColors[i]
              });
            }
          }
          $scope.legendItems = items;
        }]
    };
  }]);