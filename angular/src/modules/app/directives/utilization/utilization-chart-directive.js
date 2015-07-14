'use strict';
angular.module('patternfly.pf-components').directive('pfUtilizationChart', ['ChartsMixin', '$timeout', function(chartsMixin, $timeout) {
    return {
        restrict: 'A',
        scope: {
            config: '=',
            data: '=',
        },
        replace: true,
        templateUrl: 'modules/app/directives/utilization/utilization-chart.html',
        controller: ['$scope', function($scope) {

            if ($scope.data.available === undefined) {
                $scope.data.available = $scope.data.total - $scope.data.used;
            }
            $scope.config.available_units = $scope.config.available_units || $scope.total_units;
        }]

    };
}]);
