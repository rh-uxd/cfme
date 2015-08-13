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
          if ($scope.data.available === undefined) {
            $scope.data.available = $scope.data.total - $scope.data.used;
          }
          $scope.config.availableUnits = $scope.config.availableUnits || $scope.totalUnits;
        }]
    };
  }]);