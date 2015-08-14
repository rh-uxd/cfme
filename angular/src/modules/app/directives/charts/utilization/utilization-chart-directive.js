angular.module('cfme.charts').directive('cfmeUtilizationChart', ['ChartsMixin', '$timeout',
  function(chartsMixin, $timeout) {
    'use strict';
    return {
      restrict: 'A',
      scope: {
        config: '=',
        data: '='
      },
      replace: true,
      templateUrl: 'modules/app/directives/charts/utilization/utilization-chart.html',
      controller: ['$scope',
        function($scope) {
          var defaultSparklineConfig = {
                chartId: $scope.config.chartId,
                dataName: $scope.config.usageDataName,
                totalUnits: $scope.config.totalUnits,
                isUsageChart: true
              };
          $scope.config.sparklineConfig = $.extend(true, angular.copy(defaultSparklineConfig), $scope.config.sparklineConfig);


          if ($scope.data.available === undefined) {
            $scope.data.available = $scope.data.total - $scope.data.used;
          }
          $scope.config.availableUnits = $scope.config.availableUnits || $scope.totalUnits;
        }
      ]
    };
  }]);