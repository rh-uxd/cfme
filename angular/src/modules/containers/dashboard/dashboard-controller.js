angular.module('miq.containers.dashboardModule').controller('containers.dashboardController', ['$scope', 'ChartsDataMixin', '$translate', '$resource',
  function( $scope, chartsDataMixin, $translate, $resource ) {
    'use strict';

    $scope.navigation = "containers";

    $scope.chartHeight = chartsDataMixin.dashboardSparklineChartHeight;
    $scope.dashboardHeatmapChartHeight = chartsDataMixin.dashboardHeatmapChartHeight;

    $scope.providers = {
      title: "Providers",
      count: 0,
      href: "#containers/providers",
      notifications: []
    };
    $scope.nodesStatus = {
      title: "Nodes",
      iconClass: "pficon pficon-container-node",
      count: 0
    };
    $scope.containersStatus = {
      title: "Containers",
      iconClass: "fa fa-cube",
      count: 0
    };
    $scope.registriesStatus = {
      title:  "Registries",
      iconClass: "pficon pficon-registry",
      count: 0
    };
    $scope.projectsStatus = {
      title: "Projects",
      iconClass: "pficon pficon-project",
      count: 0,
      href: "containers/projects"
    };
    $scope.podsStatus = {
      title: "Pods",
      iconClass: "fa fa-cubes",
      count: 0,
      href: "containers/pods"
    };
    $scope.servicesStatus = {
      title: "Services",
      iconClass: "pficon pficon-service",
      count: 0
    };
    $scope.imagesStatus = {
      title: "Images",
      iconClass: "pficon pficon-image",
      count: 0
    };
    $scope.routesStatus = {
      title: "Routes",
      iconClass: "pficon pficon-route",
      count: 0
    };

    var updateStatus = function (statusObject, data) {
      statusObject.status = [];
      if (data) {
        statusObject.count = data.count;
        if (data.errorCount > 0) {
          statusObject.status.push(
            {
              iconClass: "pficon-error-circle-o",
              count: data.errorCount
            }
          );
        }
        if (data.warningCount > 0) {
          statusObject.status.push(
            {
              iconClass: "pficon-warning-triangle-o",
              count: data.warningCount
            }
          );
        }
      } else {
        statusObject.count = 0;
      }
    };

    //Get the container data
    var ContainersStatus = $resource('/containers/dashboard/status');
    ContainersStatus.get(function(response) {
      var data = response.data;
      var providers = data.providers;
      if (providers)
      {
        $scope.providers.count = providers.length;
        providers.forEach(function (item) {
          $scope.providers.notifications.push({
            iconClass: item.iconClass,
            count: item.count,
            href: "#containers/providers/?filter=" + item.providerType
          })
        });
      }
      updateStatus($scope.nodesStatus, data.nodes);
      updateStatus($scope.containersStatus, data.containers);
      updateStatus($scope.registriesStatus, data.registries);
      updateStatus($scope.projectsStatus, data.projects);
      updateStatus($scope.podsStatus, data.pods);
      updateStatus($scope.servicesStatus, data.services);
      updateStatus($scope.imagesStatus, data.images);
      updateStatus($scope.routesStatus, data.routes);
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

    // Network Utilization

    $scope.networkUtilizationCurrentConfig = chartConfig.currentNetworkUsageConfig;
    $scope.networkUtilizationCurrentConfig.tooltipFn = chartsDataMixin.sparklineTimeTooltip;

    $scope.networkUtilizationDailyConfig = chartConfig.dailyNetworkUsageConfig;

    $scope.networkUtilizationLoadingDone = false;
    var networkUtilization = $resource('/containers/dashboard/utilization');
    networkUtilization.get(function(response) {
      var data = response.data;
      $scope.currentNetworkUtilization = chartsDataMixin.getSparklineData(data.currentNetworkUsageData, $scope.networkUtilizationCurrentConfig.dataName, 60);
      chartsDataMixin.continuouslyUpdateData($scope.currentNetworkUtilization, 60 * 1000);
      $scope.dailyNetworkUtilization = chartsDataMixin.getSparklineData(data.dailyNetworkUsageData, $scope.networkUtilizationDailyConfig.dataName);
      $scope.networkUtilizationLoadingDone = true;
    });

    // Trends

    $scope.podTrendConfig = chartConfig.podTrendConfig;
    $scope.podTrendsLoadingDone = false;
    var podTrends = $resource('/containers/dashboard/pods');
    podTrends.tooltipType = 'valuePerDay';

      podTrends.get(function(response) {
      var data = response.data;
      $scope.podTrends = chartsDataMixin.getSparklineData(data.podTrends, $scope.podTrendConfig.dataName);
      $scope.podTrendsLoadingDone = true;
    });

    $scope.imageTrendConfig = chartConfig.imageTrendConfig;
    $scope.imageTrendLoadingDone = false;
    var imageTrends = $resource('/containers/dashboard/image-trends');
    imageTrends.get(function(response) {
      var data = response.data;
      $scope.imageTrends = chartsDataMixin.getSparklineData(data.imageTrends, $scope.imageTrendConfig.dataName);
      $scope.imageTrendLoadingDone = true;
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
  }
]);

