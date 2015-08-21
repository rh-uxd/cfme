angular.module('patternfly.charts').directive('pfUtilizationChart', [
  function() {
    'use strict';
    return {
      restrict: 'A',
      scope: {
        config: '=',
        chartData: '='
      },
      replace: true,
      templateUrl: 'charts/utilization-chart/utilization-chart.html',
      controller: ['$scope',
        function($scope) {
          var defaultSparklineConfig = {
            chartId: $scope.config.chartId,
            units: $scope.config.units,
            tooltipType: 'percentage'
          };
          $scope.config.sparklineConfig = $.extend(true, angular.copy(defaultSparklineConfig), $scope.config.sparklineConfig);


          if ($scope.chartData.available === undefined) {
            $scope.chartData.available = $scope.chartData.total - $scope.chartData.used;
          }
          $scope.config.availableUnits = $scope.config.availableUnits || $scope.units;
        }
      ]
    };
  }
]);