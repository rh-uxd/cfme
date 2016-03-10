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

    //Get the container data
    var ContainersStatus = $resource('/infrastructure/providers/status/' + currentId);
    ContainersStatus.get(function(response) {
      var data = response.data;
      dashboardUtils.updateAggregateStatus($scope.objectStatus.clusters, data.clusters);
      dashboardUtils.updateAggregateStatus($scope.objectStatus.hosts, data.hosts);
      dashboardUtils.updateAggregateStatus($scope.objectStatus.datastores, data.datastores);
      dashboardUtils.updateAggregateStatus($scope.objectStatus.vms, data.vms);
      dashboardUtils.updateAggregateStatus($scope.objectStatus.templates, data.templates);
      console.dir($scope.objectStatus);
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

    // HeatMaps
    $scope.nodeCpuUsage = {
      title: 'CPU',
      id: 'nodeCpuUsageMap',
      loadingDone: false
    };
    $scope.nodeMemoryUsage = {
      title: 'Memory',
      id: 'nodeMemoryUsageMap',
      loadingDone: false
    };

    $scope.heatmaps = [$scope.nodeCpuUsage, $scope.nodeMemoryUsage];

    var NodeCpuUsage = $resource('/containers/dashboard/node-cpu-usage');
    NodeCpuUsage.get(function(response) {
      var data = response.data;
      $scope.nodeCpuUsage.data = data.nodeCpuUsage;
      $scope.nodeCpuUsage.loadingDone = true;
    });

    var NodeMemoryUsage = $resource('/containers/dashboard/node-memory-usage');
    NodeMemoryUsage.get(function(response) {
      var data = response.data;
      $scope.nodeMemoryUsage.data = data.nodeMemoryUsage;
      $scope.nodeMemoryUsage.loadingDone = true;
    });

    $scope.nodeHeatMapUsageLegendLabels = chartsDataMixin.nodeHeatMapUsageLegendLabels;
    // Trends
    $scope.vmTrendConfig = chartConfig.vmTrendConfig;
    $scope.vmTrendsLoadingDone = false;
    $scope.hostTrendConfig = chartConfig.hostTrendConfig;
    $scope.hostTrendLoadingDone = false;
    var vmTrends = $resource('/infrastructure/providers/status/' + currentId);
    vmTrends.get(function(response) {
      var data = response.data;

      $scope.vmTrends = chartsDataMixin.getSparklineData(data.vmTrends, $scope.vmTrendConfig.dataName);
      console.dir($scope.vmTrends);
      $scope.vmTrendsLoadingDone = true;

      $scope.hostTrends = chartsDataMixin.getSparklineData(data.hostTrends, $scope.hostTrendConfig.dataName);
      $scope.hostTrendLoadingDone = true;
    });
  }
]);
