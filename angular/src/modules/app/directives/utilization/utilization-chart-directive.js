'use strict';
angular.module('patternfly.pf-components').directive('pfUtilizationChart', ['ChartsMixin', '$timeout', function(chartsMixin, $timeout) {
    return {
        restrict: 'A',
        scope: {
            config: '=',
            data: '=',
            radial_config: '=',
            sparkline_config: '='
        },
        replace: true,
        templateUrl: 'modules/app/directives/utilization/utilization-chart.html',
        controller: ['$scope', '$rootScope', function($scope, $rootScope) {

            if ($scope.data.available === undefined) {
                $scope.data.available = $scope.data.total - $scope.data.used;
            }
            $scope.config.available_units = $scope.config.available_units || $scope.total_units;

            $scope.radialChartId = 'radialChart';
            $scope.sparklineChartId = 'sparklineChart';
            if($scope.config.chartId) {
                $scope.radialChartId = $scope.config.chartId + $scope.radialChartId;
                $scope.sparklineChartId = $scope.config.chartId + $scope.sparklineChartId;
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

            $scope.statusRadialColor = function(scope) {
                var color = {
                    pattern: []
                };
                var percentUsed = scope.data.used / scope.data.total * 100.0;
                color.pattern[0] =  scope.getStatusColor(percentUsed);
                color.pattern[1] = '#D1D1D1';

                return color;
            };

            var utilizationRadialTooltip = {
                contents: function (d) {
                    return '<span class="c3-tooltip-sparkline" style="white-space: nowrap;">' + Math.round(d[0].ratio * 100) + '%:</span>' +
                        '<span class="c3-tooltip-sparkline" style="white-space: nowrap;">' + d[0].value + ' ' + $scope.config.total_units + ' ' + d[0].name + '</span>';
                }
            };

            $scope.getRadialData  = function(scope) {
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

            $scope.defaultRadialConfig = chartsMixin.getDefaultRadialConfig($scope.config.total_units);
            $scope.defaultRadialConfig.color =  $scope.statusRadialColor($scope);
            $scope.defaultRadialConfig.tooltip = utilizationRadialTooltip;


            var utilizationSparklineTooltip = function(scope) {
                return {
                    contents: function (d) {
                        var percentUsed = Math.round(d[0].value / scope.data.total * 100.0);

                        return '<div id="utilization-sparkline-tooltip" class="module-triangle-bottom">' +
                            '<table class="c3-tooltip">' +
                            '  <tbody>' +
                            '    <tr>' +
                            '      <th colspan="2">' + d[0].x.toLocaleDateString() + '</th>' +
                            '    </tr>' +
                            '    <tr>' +
                            '      <td class="name">' +
                            percentUsed + '%:' +
                            '      </td>' +
                            '      <td class="value" style="white-space: nowrap;">' +
                            d[0].value + ' ' + scope.config.total_units + '_' + d[0].name +
                            '</td>' +
                            '    </tr>' +
                            '  </tbody>' +
                            '</table>' +
                            '</div>';
                    },
                    position: function (data, width, height, element) {
                        try {
                            var center = parseInt(element.getAttribute('x'));
                            var top = parseInt(element.getAttribute('y'));
                            var chartBox = document.querySelector("#sparklineChart").getBoundingClientRect();
                            var graphOffsetX = document.querySelector("#sparklineChart g.c3-axis-y").getBoundingClientRect().right;

                            var x = Math.max(0, center + graphOffsetX - chartBox.left - Math.floor(width / 2));
                            x = Math.min(x, chartBox.width - width);
                            var y = top - height;

                            return {top: y, left: x};
                        }
                        catch (TypeError){};
                    }
                };
            };

            var utilizationSparklineAxis = {
                x: {
                    show: false,
                    type: 'timeseries',
                    tick: {
                        format: '%Y-%m-%d'
                    }
                },
                y: {
                    show: false
                }
            };

            $scope.getSparklineData = function(scope) {
                var usage = [scope.config.usage_data_name];
                var dates = ['dates'];

                if (scope.data)
                {
                    usage = usage.concat(usage, scope.data.data);

                    if ($scope.data.dates && scope.data.dates.length > 0) {
                        for (var i=0; i<scope.data.dates.length; i++) {
                            dates.push(new Date(scope.data.dates[i]));
                        }
                    }
                    else {
                        // Use fake dates
                        var today = new Date();
                        for (var d=scope.data.data.length - 1; d>=0; d--) {
                            dates.push(new Date(today.getTime() - (d * 24 * 60 * 60 * 1000)));
                        }
                    }
                }

                return {
                    x: 'dates',
                    columns: [
                        dates,
                        usage
                    ],
                    type: 'area'
                };
            };

            $scope.defaultSparklineConfig = chartsMixin.getDefaultSparklineConfig($scope.config.total_units);
            $scope.defaultSparklineConfig.axis = utilizationSparklineAxis;
            $scope.defaultSparklineConfig.tooltip = utilizationSparklineTooltip($scope);

            $scope.config.radial_config = $.extend(true, angular.copy($scope.defaultRadialConfig), $scope.config.radial_config);
            $scope.config.radial_config.data = $scope.getRadialData($scope);
            $scope.config.sparkline_config = $.extend(true, angular.copy($scope.defaultSparklineConfig), $scope.config.sparkline_config);
            $scope.config.sparkline_config.data = $scope.getSparklineData($scope);

        }],

        link: function(scope, element, attrs){

            attrs.$observe('radial_config', function(){
                scope.config.radial_config = $.extend(true, angular.copy(scope.defaultRadialConfig), scope.config.radial_config);
                scope.config.radial_config.data = scope.getRadialData(scope);
                setupRadialChartTitle();
            });

            attrs.$observe('sparkline_config', function(){
                scope.config.sparkline_config = $.extend(true, angular.copy(scope.defaultSparklineConfig), scope.config.sparkline_config);
                scope.config.sparkline_config.data = scope.getSparklineData(scope);
            });

            attrs.$observe('data', function(){
                scope.config.radial_config.data = scope.getRadialData(scope);
                scope.config.sparkline_config.data = scope.getSparklineData(scope);
                setupRadialChartTitle();
            });

            attrs.$observe('config', function(){
                scope.config.radial_config = $.extend(true, angular.copy(scope.defaultRadialConfig), scope.config.radial_config);
                scope.config.radial_config.data = scope.getRadialData(scope);
                scope.config.sparkline_config = $.extend(true, angular.copy(scope.defaultSparklineConfig), scope.config.sparkline_config);
                scope.config.sparkline_config.data = scope.getSparklineData(scope);
                setupRadialChartTitle();
            });

            scope.config.radial_config = $.extend(true, angular.copy(scope.defaultRadialConfig), scope.config.radial_config);
            scope.config.radial_config.data = scope.getRadialData(scope);
            scope.config.sparkline_config = $.extend(true, angular.copy(scope.defaultSparklineConfig), scope.config.sparkline_config);
            scope.config.sparkline_config.data = scope.getSparklineData(scope);

            var setupRadialChartTitle = function () {
                $timeout(function () {
                    var radialChartTitle = element[0].querySelector('text.c3-chart-arcs-title');
                    radialChartTitle.innerHTML = '<tspan dy="0" x="0" class="utilization-chart-title-big">' + scope.data.used + '</tspan>' +
                    '<tspan dy="20" x="0" class="utilization-chart-title-small">' + scope.config.total_units + ' ' + scope.config.usage_data_name + '</tspan>';
                }, 100);
            };
        }
    };
}]);
