angular.module('cfme.charts').directive('cfmeSparklineChart', ['ChartsMixin', '$timeout',
  function(chartsMixin, $timeout) {
    'use strict';
    return {
      restrict: 'A',
      scope: {
        config: '=',
        data: '=',
        chartHeight: '=',
        showXAxis: '@',
        showYAxis: '@'
      },
      replace: true,
      templateUrl: 'modules/app/directives/charts/sparkline/sparkline-chart.html',
      controller: ['$scope',
        function($scope) {
          $scope.sparklineChartId = 'sparklineChart';
          if ($scope.config.chartId) {
            $scope.sparklineChartId = $scope.config.chartId + $scope.sparklineChartId;
          }

          var sparklineTooltip = function(scope) {
            return {
              contents: function(d) {
                if (scope.config.tooltipFn) {
                  var tootipHtml = '<div id="utilization-sparkline-tooltip" class="module-triangle-bottom">' +
                      '  <table class="c3-tooltip">' +
                      '    <tbody>' +
                          scope.config.tooltipFn(d) +
                      '    </tbody>' +
                      '  </table>' +
                      '</div>';
                  return tootipHtml
                }
                else if (scope.config.isUsageChart) {
                  var percentUsed = Math.round(d[0].value / scope.data.total * 100.0);
                  return '<div id="utilization-sparkline-tooltip" class="module-triangle-bottom">' +
                      '  <table class="c3-tooltip">' +
                      '    <tbody>' +
                      '      <tr>' +
                      '        <th colspan="2">' + d[0].x.toLocaleDateString() + '</th>' +
                      '      </tr>' +
                      '      <tr>' +
                      '        <td class="name">' + percentUsed + '%:' + '      </td>' +
                      '        <td class="value" style="white-space: nowrap;">' + d[0].value + ' ' + scope.config.totalUnits + ' ' + d[0].name + '</td>' +
                      '      </tr>' +
                      '    </tbody>' +
                      '  </table>' +
                      '</div>';
                }
                else {
                  return '<div id="utilization-sparkline-tooltip" class="module-triangle-bottom">' +
                         '  <table class="c3-tooltip">' +
                         '    <tbody>' +
                         '      <tr>' +
                         '        <td class="value">' +  d[0].x.toLocaleDateString() + '</td>' +
                         '        <td class="value" style="white-space: nowrap;">' +  d[0].value + ' ' + d[0].name + '</td>' +
                         '      </tr>' +
                         '    </tbody>' +
                         '  </table>' +
                         '</div>';
                }
              },
              position: function(data, width, height, element) {
                try {
                  var center = parseInt(element.getAttribute('x'));
                  var top = parseInt(element.getAttribute('y'));
                  var chartBox = document.querySelector('#' + scope.sparklineChartId).getBoundingClientRect();
                  var graphOffsetX = document.querySelector('#' + scope.sparklineChartId + ' g.c3-axis-y').getBoundingClientRect().right;
                  var x = Math.max(0, center + graphOffsetX - chartBox.left - Math.floor(width / 2));
                  x = Math.min(x, chartBox.width - width);
                  var y = top - height;
                  return {
                    top: y,
                    left: x
                  };
                } catch (TypeError) {
                  console.dir(TypeError);
                }
              }
            };
          };

          if ($scope.showXAxis === undefined)
          {
            $scope.showXAxis = ($scope.config.showAxis !== undefined) && $scope.config.showAxis;
          }
          if ($scope.showYAxis === undefined)
          {
            $scope.showYAxis = ($scope.config.showAxis !== undefined) && $scope.config.showAxis;
          }
          var sparklineAxis = {
            x: {
              show: $scope.showXAxis,
              type: 'timeseries',
              tick: {
                format: function () { return ''; }
              }
            },
            y: {
              show: $scope.showYAxis,
              tick: {
                format: function () { return ''; }
              }
            }
          };
          $scope.getSparklineData = function(scope) {
            var sparklineData = [scope.config.dataName];
            var dates = ['dates'];
            if (scope.data) {
              sparklineData = sparklineData.concat(scope.data.data);
              if ($scope.data.dates && scope.data.dates.length > 0) {
                for (var i = 0; i < scope.data.dates.length; i++) {
                  dates.push(new Date(scope.data.dates[i]));
                }
              } else {
                // Use fake dates
                var today = new Date();
                for (var d = scope.data.data.length - 1; d >= 0; d--) {
                  dates.push(new Date(today.getTime() - (d * 24 * 60 * 60 * 1000)));
                }
              }
            }
            return {
              x: 'dates',
              columns: [
                dates,
                sparklineData
              ],
              type: 'area'
            };
          };
          $scope.defaultConfig = chartsMixin.getDefaultSparklineConfig($scope.config.totalUnits);
          $scope.defaultConfig.axis = sparklineAxis;
          $scope.defaultConfig.tooltip = sparklineTooltip($scope);
          if ($scope.chartHeight) {
            $scope.defaultConfig.size.height = $scope.chartHeight;
          }
          $scope.config = $.extend(true, angular.copy($scope.defaultConfig), $scope.config);
          $scope.config.data = $scope.getSparklineData($scope);
        }],
      link: function(scope, element, attrs) {
        attrs.$observe('config', function() {
          scope.config = $.extend(true, angular.copy(scope.defaultConfig), scope.config);
          scope.config.data = scope.getSparklineData(scope);
        });
      }
    };
  }]);