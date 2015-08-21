angular.module('cfme.containersModule').factory('ChartsDataMixin', ['$timeout', '$q', function chartDataMixinFactory ($timeout, $q) {

  var doFakeUpdate = function (data) {
    var newXData = [];
    var newYData = [];
    var length = data.yData.length;

    newXData[0] = data.xData[0];
    newYData[0] = data.yData[0];

    for (var i = 2; i < length; i++)
    {
      newXData[i - 1] = data.xData[i];
      newYData[i - 1] = data.yData[i];
    }
    newXData[length - 1] = new Date();
    newYData[length - 1] = data.yData[1];

    data.xData = newXData;
    data.yData = newYData;
    data.lastUpdate = newXData[length - 1];
  };

  var continuouslyUpdateData = function (data, frequencyInMs) {

    var updateAfterDelayPromise = function (data) {
      var defer = $q.defer();

      $timeout(function () {
        doFakeUpdate(data);
        defer.resolve();
      }, frequencyInMs);
      return defer.promise;
    };

    var fulfill = function () {
      updateAfterDelayPromise(data).then(fulfill);
    };
    updateAfterDelayPromise(data).then(fulfill);
  };

  var getSparklineData = function (data, dataName, isMinutes) {
    var sparklineData = [dataName || 'data'];
    var dates = ['dates'];

    if (data) {
      // Add the data to the sparkline data
      sparklineData = sparklineData.concat(data.data);

      // Add the x axis data to the sparkline data
      if (data.dates && data.dates.length > 0) {
        for (var i = 0; i < data.dates.length; i++) {
          dates.push(new Date(data.dates[i]));
        }
      }
      else {
        // Use fake dates
        var today = new Date();
        for (var d = data.data.length - 1; d >= 0; d--) {
          if (isMinutes === true) {
            dates.push(new Date(today.getTime() - (d * 60 * 1000)));
          }
          else {
            dates.push(new Date(today.getTime() - (d * 24 * 60 * 60 * 1000)));
          }
        }
      }
    }
    return {
      xDataName: 'dates',
      xData:     dates,
      yData:      sparklineData
    };
  };

  var getCpuUsageDataFromResponse = function(response, usageDataName) {
    var data = response.data;

    var cpuUsageData = data.cpuUsageData;
    var sparklineData = getSparklineData(data.cpuUsageData, usageDataName);
    cpuUsageData.xDataName = sparklineData.xDataName;
    cpuUsageData.xData = sparklineData.xData;
    cpuUsageData.yData = sparklineData.yData;

    return cpuUsageData;
  };

  var getMemoryUsageDataFromResponse = function(response, usageDataName) {
    var data = response.data;

    var memoryUsageData = data.memoryUsageData;
    var sparklineData = getSparklineData(data.memoryUsageData, usageDataName);
    memoryUsageData.xDataName = sparklineData.xDataName;
    memoryUsageData.xData = sparklineData.xData;
    memoryUsageData.yData = sparklineData.yData;

    return memoryUsageData;
  };

  var sparklineTimeTooltip = function(d) {
    return '  <table class="c3-tooltip">' +
        '    <tbody>' +
        '      <td class="value">' +  d[0].x.toLocaleTimeString() + '</td>' +
        '      <td class="value text-nowrap">' +  d[0].value + ' ' + d[0].name + '</td>' +
        '    </tbody>' +
        '  </table>';
  };

  var dashboardSparklineChartHeight = 57;
  var dashboardHeatmapChartHeight = "233px";

  var nodeHeatMapUsageLegendLabels = ['< 70%', '70-80%' ,'80-90%', '> 90%'];

  return {
    continuouslyUpdateData:         continuouslyUpdateData,
    getSparklineData:               getSparklineData,
    getCpuUsageDataFromResponse:    getCpuUsageDataFromResponse,
    getMemoryUsageDataFromResponse: getMemoryUsageDataFromResponse,
    sparklineTimeTooltip:           sparklineTimeTooltip,
    dashboardSparklineChartHeight:  dashboardSparklineChartHeight,
    dashboardHeatmapChartHeight:    dashboardHeatmapChartHeight,
    nodeHeatMapUsageLegendLabels:   nodeHeatMapUsageLegendLabels
  };
}]);