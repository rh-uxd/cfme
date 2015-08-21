'use strict';
angular.module('cfme.charts').directive('cfmeTrends', ['cfmeChartDefaults', '$timeout',
  function(c3ChartDefaults, $timeout) {
    return {
      restrict: 'A',
      scope: {
        config: '=',
        data: '=',
        chartHeight: '=',
        id: '@'
      },
      replace: true,
      templateUrl: 'modules/app/directives/charts/trends/trends-chart.html',
      controller: ['$scope', '$rootScope',
        function($scope, $rootScope) {
          var me = this;
          if ($scope.chartHeight === undefined) {
            $scope.chartHeight = 71;
          }

          $scope.containerId = $scope.id.trim();
          $scope.chartId = $scope.containerId + 'Chart';

          this.chartColor = {
            pattern: ['#0088ce', '#00659c', '#3f9c35', '#ec7a08', '#cc0000']
          };

          var chartTooltip = function(scope) {
            return {
              contents: function(d) {
                return '<div id="container-group-trends-tooltip">' + '<table class="c3-tooltip">' + '  <tbody>' + '    <tr>' + '      <th colspan="2">' + d[0].x.toLocaleDateString() + '</th>' + '    </tr>' + '    <tr">' + '      <td class="name">' + '        <span style="background-color:' + me.chartColor.pattern[0] + '"></span>' + d[0].name + ':' + '      </td>' + '      <td class="value" style="white-space: nowrap;">' + '         +' + d[0].value + ' ' + scope.config.tooltipSuffixes[0] + '      </td>' + '    </tr>' + '    <tr">' + '      <div style="background-color:' + me.chartColor.pattern[1] + '"> </div>' + '      <td class="name">' + '        <span style="background-color:' + me.chartColor.pattern[1] + '"></span>' + d[1].name + ':' + '      </td>' + '      <td class="value" style="white-space: nowrap;">' + '         -' + d[1].value + ' ' + scope.config.tooltipSuffixes[1] + '      </td>' + '    </tr>' + '  </tbody>' + '</table>' + '</div>';
              },
              position: function(data, width, height, element) {
                var center = parseInt(element.getAttribute('x'));
                var top = parseInt(element.getAttribute('y'));
                var chartBox = document.querySelector('#' + scope.chartId).getBoundingClientRect();
                var graphOffsetX = document.querySelector('#' + scope.chartId + ' g.c3-axis-y').getBoundingClientRect().right;
                var x = Math.max(0, center + graphOffsetX - chartBox.left - Math.floor(width / 2));
                x = Math.min(x, chartBox.width - width);
                var y = top - height;
                return {
                  top: y,
                  left: x
                };
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

          $scope.getChartData = function() {
            var id = $scope.id.trim();
            var dates = ['dates'];
            var data = this.data;

            if (data) {
              var keys = [];
              for (var key in data) {
                keys.push(key);
              }

              var dateLength = data[keys[0]].length;
              if (data.dates && data.dates.length > 0) {
                for (var i = 0; i < data.dates.length; i++) {
                  dates.push(new Date(data.dates[i]));
                }
              } else {
                // Use fake dates
                var today = new Date();
                for (var d = dateLength - 1; d >= 0; d--) {
                  dates.push(new Date(today.getTime() - (d * 24 * 60 * 60 * 1000)));
                }
              }
              var columns = [dates];
              if ($scope.config.labels.length > 0) {
                $scope.config.labels.forEach(function (item, index) {
                  var trend = [item];
                  trend = trend.concat(data[keys[index]]);
                  columns.push(trend);
                });
              }
            }

            var retVal = {
              x: 'dates',
              columns: columns,
              type: 'area'
            };

            return retVal;
          };

          var chartPoint = {
            show: false
          };

          var chartSize = {
            height: $scope.chartHeight
          };

          var chartLegend = {
            show: false
          };

          $scope.chartConfig = {
            point: chartPoint,
            size: chartSize,
            axis: chartAxis,
            color: this.chartColor,
            tooltip: chartTooltip($scope),
            legend: chartLegend,
            data: $scope.getChartData()
          };
        }
      ],
      link: function(scope, element, attrs) {
        attrs.$observe('data', function() {
          scope.chartConfig.data = scope.getChartData();
        });
      }
    };
  }
]);