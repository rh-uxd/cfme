angular.module('miq.infrastructure.providersModule').controller('infrastructure.providerController', ['$scope','ChartsDataMixin', 'DashboardUtils', '$translate', '$resource', '$routeParams',
  function( $scope, chartsDataMixin, dashboardUtils, $translate, $resource, $routeParams ) {
    'use strict';

    $scope.chartHeight = chartsDataMixin.dashboardSparklineChartHeight;
    $scope.dashboardHeatmapChartHeight = chartsDataMixin.dashboardHeatmapChartHeight;

    var currentId = $routeParams.id;
    if (typeof(currentId) === "undefined") {
      currentId = "MyVMProvider"
    }
    $scope.navigation = currentId;

    $scope.providerType = 'openshift';
    $scope.getProviderTypeIconClass = function () {
      return 'pficon-' + $scope.providerType;
    };
    $scope.objectStatus = {
      clusters:     dashboardUtils.createClustersStatus(),
      hosts:        dashboardUtils.createHostsStatus(),
      datastores:   dashboardUtils.createDatastoresStatus(),
      vms:          dashboardUtils.createVMsStatus(),
      templates:    dashboardUtils.createTemplatesStatus()
    };

    $scope.clusterCpuUsage = {
      title: 'CPU',
      id: 'nodeCpuUsageMap',
      loadingDone: false
    };
    $scope.clusterMemoryUsage = {
      title: 'Memory',
      id: 'nodeMemoryUsageMap',
      loadingDone: false
    };
    $scope.heatmaps = [$scope.clusterCpuUsage, $scope.clusterMemoryUsage];
    $scope.nodeHeatMapUsageLegendLabels = chartsDataMixin.nodeHeatMapUsageLegendLabels;

    var getUsageTooltip = function (name, used, total) {
      return name + "<span class='pull-right'>" + (Math.round((used / total) * 1000) / 10) + "%</span><br>" + used + " Used of " + total + " Total<br>" + (total - used) + " Available"
    };

    //Get the container data
    var ContainersStatus = $resource('/infrastructure/providers/status/' + currentId);
    ContainersStatus.get(function(response) {
      var data = response.data;
      dashboardUtils.updateAggregateStatus($scope.objectStatus.clusters, data.clusters);
      dashboardUtils.updateAggregateStatus($scope.objectStatus.hosts, data.hosts);
      dashboardUtils.updateAggregateStatus($scope.objectStatus.datastores, data.datastores);
      dashboardUtils.updateAggregateStatus($scope.objectStatus.vms, data.vms);
      dashboardUtils.updateAggregateStatus($scope.objectStatus.templates, data.templates);

      $scope.clusterCpuUsage.data = [];
      data.clusterCpuUsage.forEach(function(item) {
        $scope.clusterCpuUsage.data.push({
          id: "Cluster " + item.id,
          value: item.used / item.total,
          tooltip: getUsageTooltip("Cluster " + item.id, item.used, item.total)
        })
      });
      $scope.clusterCpuUsage.loadingDone = true;

      $scope.clusterMemoryUsage.data = [];
      data.clusterMemoryUsage.forEach(function(item) {
        $scope.clusterMemoryUsage.data.push({
          id: "Cluster " + item.id,
          value: item.used / item.total,
          tooltip: getUsageTooltip("Cluster " + item.id, item.used, item.total)
        })
      });
      $scope.clusterMemoryUsage.loadingDone = true;

    });


    // Node Utilization
    $scope.cpuUsageConfig = chartConfig.cpuUsageConfig;
    $scope.cpuUsageSparklineConfig = {
      tooltipType: 'valuePerDay',
      chartId: 'cpuSparklineChart'
    };
    $scope.cpuUsageDonutConfig = {
      chartId: 'cpuDonutChart',
      thresholds: {'warning':'60','error':'90'}
    };
    $scope.memoryUsageConfig = chartConfig.memoryUsageConfig;
    $scope.memoryUsageSparklineConfig = {
      tooltipType: 'valuePerDay',
      chartId: 'memorySparklineChart'
    };
    $scope.memoryUsageDonutConfig = {
      chartId: 'memoryDonutChart',
      thresholds: {'warning':'60','error':'90'}
    };

    $scope.utilizationLoadingDone = false;
    var ContainersUtilization = $resource('/containers/dashboard/utilization');
    ContainersUtilization.get(function(response) {
      $scope.cpuUsageData = chartsDataMixin.getCpuUsageDataFromResponse(response, $scope.cpuUsageConfig.usageDataName);
      $scope.memoryUsageData = chartsDataMixin.getMemoryUsageDataFromResponse(response, $scope.memoryUsageConfig.usageDataName);
      $scope.utilizationLoadingDone = true;
    });

    // Trends
    $scope.vmTrendConfig = chartConfig.vmTrendConfig;
    $scope.vmTrendsLoadingDone = false;
    $scope.hostTrendConfig = chartConfig.hostTrendConfig;
    $scope.hostTrendLoadingDone = false;
    var vmTrends = $resource('/infrastructure/providers/status/' + currentId);
    vmTrends.get(function(response) {
      var data = response.data;

      $scope.vmTrends = chartsDataMixin.getSparklineData(data.vmTrends, $scope.vmTrendConfig.dataName);
      $scope.vmTrendsLoadingDone = true;

      $scope.hostTrends = chartsDataMixin.getSparklineData(data.hostTrends, $scope.hostTrendConfig.dataName);
      $scope.hostTrendLoadingDone = true;
    });
  }
]);
