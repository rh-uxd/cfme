'use strict';
angular.module('patternfly.pf-components').directive('cfmeImageTrends', ['ChartsMixin', '$timeout', function(chartsMixin, $timeout) {
    return {
        restrict: 'A',
        scope: {
            data: '=',
            id: '@'
        },
        replace: true,
        templateUrl: 'modules/app/components/trends-chart.directive.html',
        controller: function($scope, $rootScope) {
            var me = this;

            $scope.containerId = ($scope.id || 'containerGroupTrends').trim();
            $scope.chartId = $scope.containerId + 'Chart';

            this.chartColor = {
                pattern: ['#6ca100', '#0088ce']
            };

            var chartTooltip = function(scope) {
                return {
                    contents: function (d) {
                        return '<div id="image-creation-trends-tooltip">' +
                            '<table class="c3-tooltip">' +
                            '  <tbody>' +
                            '    <tr>' +
                            '      <th colspan="2">' + d[0].x.toLocaleDateString() + '</th>' +
                            '    </tr>' +
                            '    <tr">' +
                            '      <td class="name">' +
                            '        <span style="background-color:' + me.chartColor.pattern[0] + '"></span>' +
                            d[0].name + ':' +
                            '      </td>' +
                            '      <td class="value" style="white-space: nowrap;">' +
                            d[0].value +
                            '      </td>' +
                            '    </tr>' +
                            '    <tr">' +
                            '      <div style="background-color:' + me.chartColor.pattern[1] + '"> </div>' +
                            '      <td class="name">' +
                            '        <span style="background-color:' + me.chartColor.pattern[1] + '"></span>' +
                            d[1].name + ':' +
                            '      </td>' +
                            '      <td class="value" style="white-space: nowrap;">' +
                            d[1].value + ' GB'  +
                            '      </td>' +
                            '    </tr>' +
                            '  </tbody>' +
                            '</table>' +
                            '</div>';
                    },
                    position: function (data, width, height, element) {
                        var center = parseInt(element.getAttribute('x'));
                        var top = parseInt(element.getAttribute('y'));
                        var chartBox = document.querySelector("#" + scope.chartId).getBoundingClientRect();
                        var graphOffsetX = document.querySelector("#" + scope.chartId + " g.c3-axis-y").getBoundingClientRect().right;

                        var x = Math.max(0, center + graphOffsetX - chartBox.left - Math.floor(width / 2));
                        x = Math.min(x, chartBox.width - width);
                        var y = top - height;

                        return {top: y, left: x};
                    }
                };
            };

            var chartAxis = {
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

            $scope.getChartData = function () {
                var totalImages = ['Images'];
                var totalSize = ['Total Size'];
                var dates = ['dates'];
                var data = this.data;

                if (data)
                {
                    totalImages = totalImages.concat(data.totalImages);
                    totalSize = totalSize.concat(data.totalSize);

                    if (data.dates && data.dates.length > 0)
                    {
                        for (var i = 0; i < data.dates.length; i++)
                        {
                            dates.push(new Date(data.dates[i]));
                        }
                    }
                    else
                    {
                        // Use fake dates
                        var today = new Date();
                        for (var d = data.totalImages.length - 1; d >= 0; d--)
                        {
                            dates.push(new Date(today.getTime() - (d * 24 * 60 * 60 * 1000)));
                        }
                    }
                }

                return {
                    x: 'dates',
                    columns: [
                        dates,
                        totalImages,
                        totalSize
                    ],
                    axes: {
                        'Images': 'y',
                        'Total Size': 'y2'
                    },
                    type: 'area'
                };
            };

            var chartPoint = {
                show: false
            };

            var chartSize = {
                height: 71
            };

            $scope.chartConfig = {
                point:   chartPoint,
                size:    chartSize,
                axis:    chartAxis,
                color:   this.chartColor,
                tooltip: chartTooltip($scope),
                data:    $scope.getChartData()
            };

        },

        link: function(scope, element, attrs){

            attrs.$observe('data', function(){
                scope.chartConfig.data = scope.getChartData();
            });
        }
    };
}]);
