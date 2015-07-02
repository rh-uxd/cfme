'use strict';
angular.module('patternfly.pf-components').directive('pfHeatMapLegend', ['ChartsMixin', '$timeout', function(chartsMixin, $timeout) {
    return {
        restrict: 'A',
        scope: {
            legend: '='
        },
        replace: true,
        templateUrl: 'modules/app/components/heatmap-legend.html',
        controller: function ($scope, $rootScope) {
            var items = [];
            var legendColors = chartsMixin.getDefaultHeatmapColorPattern();

            if ($scope.legend)
            {
                for (var i = $scope.legend.length - 1; i >= 0; i--)
                {
                    items.push({text: $scope.legend[i], color: legendColors[i]});
                }
            }
            $scope.legend_items = items;
        }
    }
}]);
