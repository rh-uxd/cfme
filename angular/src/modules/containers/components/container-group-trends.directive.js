'use strict';
angular.module('cfme.containersModule').directive('cfmeGroupTrends', ['ChartsMixin', '$timeout', function(chartsMixin, $timeout) {
    return {
        restrict: 'A',
        scope: {
            data: '=',
            id: '@'
        },
        replace: true,
        templateUrl: 'modules/containers/components/container-group-trends.directive.html',
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
                        return '<div id="container-group-trends-tooltip">' +
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
                            '         +' + d[0].value + ' Container Groups'  +
                            '      </td>' +
                            '    </tr>' +
                            '    <tr">' +
                            '      <div style="background-color:' + me.chartColor.pattern[1] + '"> </div>' +
                            '      <td class="name">' +
                            '        <span style="background-color:' + me.chartColor.pattern[1] + '"></span>' +
                            d[1].name + ':' +
                            '      </td>' +
                            '      </td>' +
                            '      <td class="value" style="white-space: nowrap;">' +
                            '         -' + d[1].value + ' Container Groups'  +
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
                var creations = ['Created'];
                var deletions = ['Deleted'];
                var dates = ['dates'];
                var data = this.data;

                if (data)
                {
                    creations = creations.concat(data.creations);
                    deletions = deletions.concat(data.deletions);

                    if (data.dates && data.dates.length > 0) {
                        for (var i=0; i<data.dates.length; i++) {
                            dates.push(new Date(data.dates[i]));
                        }
                    }
                    else {
                        // Use fake dates
                        var today = new Date();
                        for (var d=data.creations.length - 1; d>=0; d--) {
                            dates.push(new Date(today.getTime() - (d * 24 * 60 * 60 * 1000)));
                        }
                    }
                }

                return {
                    x: 'dates',
                    columns: [
                        dates,
                        creations,
                        deletions
                    ],
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
