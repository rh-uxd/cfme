'use strict';
angular.module('patternfly.pf-components').directive('pfDonutPctChart', ['ChartsMixin', '$timeout', function(chartsMixin, $timeout) {
    return {
        restrict: 'A',
        scope: {
            config: '=',
            data: '=',
        },
        replace: true,
        templateUrl: 'modules/app/directives/donut/donut-percent-chart.html',
        controller: ['$scope', function($scope) {

            $scope.donutChartId = 'donutChart';
            if($scope.config.chartId) {
                $scope.donutChartId = $scope.config.chartId + $scope.donutChartId;
            }

            $scope.getStatusColor = function(used) {
                if (used >= 90.0)
                {
                    return '#CC0000';
                }
                else if (used >= 75.0)
                {
                    return '#EC7A08';
                }
                else {
                    return '#0088CE';
                }
            };

            $scope.statusDonutColor = function(scope) {
                var color = {
                    pattern: []
                };
                var percentUsed = scope.data.used / scope.data.total * 100.0;
                color.pattern[0] =  scope.getStatusColor(percentUsed);
                color.pattern[1] = '#D1D1D1';

                return color;
            };

            var donutTooltip = {
                contents: function (d) {
                    return '<span class="c3-tooltip-sparkline" style="white-space: nowrap;">' + Math.round(d[0].ratio * 100) + '%:</span>' +
                        '<span class="c3-tooltip-sparkline" style="white-space: nowrap;">' + d[0].value + ' ' + $scope.config.total_units + ' ' + d[0].name + '</span>';
                }
            };

            $scope.getDonutData  = function(scope) {
                return {
                    columns: [
                        ['Used', scope.data.used],
                        ['Available', scope.data.available]
                    ],
                    type: 'donut',
                    donut: {
                        label: {
                            show: false
                        }
                    },
                    groups: [
                        ['used', 'available']
                    ],
                    order: null
                };
            };

            $scope.defaultDonutConfig = chartsMixin.getDefaultRadialConfig($scope.config.total_units);
            $scope.defaultDonutConfig.color =  $scope.statusDonutColor($scope);
            $scope.defaultDonutConfig.tooltip = donutTooltip;

            $scope.config.donut_config = $.extend(true, angular.copy($scope.defaultDonutConfig), $scope.config.donut_config);
            $scope.config.donut_config.data = $scope.getDonutData($scope);
        }],

        link: function(scope, element, attrs){

            attrs.$observe('config', function(){
                scope.config.donut_config = $.extend(true, angular.copy(scope.defaultDonutConfig), scope.config.donut_config);
                scope.config.donut_config.data = scope.getDonutData(scope);
                setupDonutChartTitle();
            });

            var setupDonutChartTitle = function () {
                $timeout(function () {
                    var donutChartTitle = element[0].querySelector('text.c3-chart-arcs-title');
                    donutChartTitle.innerHTML = '<tspan dy="0" x="0" class="utilization-chart-title-big">' + scope.data.used + '</tspan>' +
                    '<tspan dy="20" x="0" class="utilization-chart-title-small">' + scope.config.total_units + ' ' + scope.config.usage_data_name + '</tspan>';
                }, 100);
            };
        }
    };
}]);
