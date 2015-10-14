angular.module('miq.containers.dashboardModule').controller('containers.dashboardController', ['$scope', 'ChartsDataMixin', '$translate', '$resource',
  function( $scope, chartsDataMixin, $translate, $resource ) {
    'use strict';

    // stash a ref to the controller object, and the various parent objects
    var vm = this;

    vm.navigation = "containers";

    vm.chartHeight = chartsDataMixin.dashboardSparklineChartHeight;
    vm.dashboardHeatmapChartHeight = chartsDataMixin.dashboardHeatmapChartHeight;

    vm.providers = {
      title: "Providers",
      count: 0,
      href: "#containers/providers",
      notifications: []
    };
    vm.nodesStatus = {
      title: "Nodes",
      iconClass: "pficon pficon-container-node",
      count: 0
    };
    vm.containersStatus = {
      title: "Containers",
      iconClass: "fa fa-cube",
      count: 0
    };
    vm.registriesStatus = {
      title:  "Registries",
      iconClass: "pficon pficon-registry",
      count: 0
    };
    vm.projectsStatus = {
      title: "Projects",
      iconClass: "pficon pficon-project",
      count: 0,
      href: "containers/projects"
    };
    vm.podsStatus = {
      title: "Pods",
      iconClass: "fa fa-cubes",
      count: 0,
      href: "containers/pods"
    };
    vm.servicesStatus = {
      title: "Services",
      iconClass: "pficon pficon-service",
      count: 0
    };
    vm.imagesStatus = {
      title: "Images",
      iconClass: "pficon pficon-image",
      count: 0
    };
    vm.routesStatus = {
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
        vm.providers.count = providers.length;
        providers.forEach(function (item) {
          vm.providers.notifications.push({
            iconClass: item.iconClass,
            count: item.count,
            href: "#containers/providers/?filter=" + item.providerType
          })
        });
      }
      updateStatus(vm.nodesStatus, data.nodes);
      updateStatus(vm.containersStatus, data.containers);
      updateStatus(vm.registriesStatus, data.registries);
      updateStatus(vm.projectsStatus, data.projects);
      updateStatus(vm.podsStatus, data.pods);
      updateStatus(vm.servicesStatus, data.services);
      updateStatus(vm.imagesStatus, data.images);
      updateStatus(vm.routesStatus, data.routes);
    });

    // Node Utilization

    vm.cpuUsageConfig = chartConfig.cpuUsageConfig;
    vm.cpuUsageSparklineConfig = {
      tooltipType: 'valuePerDay',
      chartId: 'cpuSparklineChart'
    };
    vm.cpuUsageDonutConfig = {
      chartId: 'cpuDonutChart',
      thresholds: {'warning':'60','error':'90'}
    };
    vm.memoryUsageConfig = chartConfig.memoryUsageConfig;
    vm.memoryUsageSparklineConfig = {
      tooltipType: 'valuePerDay',
      chartId: 'memorySparklineChart'
    };
    vm.memoryUsageDonutConfig = {
      chartId: 'memoryDonutChart',
      thresholds: {'warning':'60','error':'90'}
    };

    vm.utilizationLoadingDone = false;
    var ContainersUtilization = $resource('/containers/dashboard/utilization');
    ContainersUtilization.get(function(response) {
      vm.cpuUsageData = chartsDataMixin.getCpuUsageDataFromResponse(response, vm.cpuUsageConfig.usageDataName);
      vm.memoryUsageData = chartsDataMixin.getMemoryUsageDataFromResponse(response, vm.memoryUsageConfig.usageDataName);
      vm.utilizationLoadingDone = true;
    });

    // Network Utilization

    vm.networkUtilizationCurrentConfig = chartConfig.currentNetworkUsageConfig;
    vm.networkUtilizationCurrentConfig.tooltipFn = chartsDataMixin.sparklineTimeTooltip;

    vm.networkUtilizationDailyConfig = chartConfig.dailyNetworkUsageConfig;

    vm.networkUtilizationLoadingDone = false;
    var networkUtilization = $resource('/containers/dashboard/utilization');
    networkUtilization.get(function(response) {
      var data = response.data;
      vm.currentNetworkUtilization = chartsDataMixin.getSparklineData(data.currentNetworkUsageData, vm.networkUtilizationCurrentConfig.dataName, 60);
      chartsDataMixin.continuouslyUpdateData(vm.currentNetworkUtilization, 60 * 1000);
      vm.dailyNetworkUtilization = chartsDataMixin.getSparklineData(data.dailyNetworkUsageData, vm.networkUtilizationDailyConfig.dataName);
      vm.networkUtilizationLoadingDone = true;
    });

    // Trends

    vm.podTrendConfig = chartConfig.podTrendConfig;
    vm.podTrendsLoadingDone = false;
    var podTrends = $resource('/containers/dashboard/pods');
    podTrends.tooltipType = 'valuePerDay';

      podTrends.get(function(response) {
      var data = response.data;
      vm.podTrends = chartsDataMixin.getSparklineData(data.podTrends, vm.podTrendConfig.dataName);
      vm.podTrendsLoadingDone = true;
    });

    vm.imageTrendConfig = chartConfig.imageTrendConfig;
    vm.imageTrendLoadingDone = false;
    var imageTrends = $resource('/containers/dashboard/image-trends');
    imageTrends.get(function(response) {
      var data = response.data;
      vm.imageTrends = chartsDataMixin.getSparklineData(data.imageTrends, vm.imageTrendConfig.dataName);
      vm.imageTrendLoadingDone = true;
    });

    // HeatMaps

    vm.nodeCpuUsage = {
      title: 'CPU',
      id: 'nodeCpuUsageMap',
      loadingDone: false
    };
    vm.nodeMemoryUsage = {
      title: 'Memory',
      id: 'nodeMemoryUsageMap',
      loadingDone: false
    };

    vm.heatmaps = [vm.nodeCpuUsage, vm.nodeMemoryUsage];

    var NodeCpuUsage = $resource('/containers/dashboard/node-cpu-usage');
    NodeCpuUsage.get(function(response) {
      var data = response.data;
      vm.nodeCpuUsage.data = data.nodeCpuUsage;
      vm.nodeCpuUsage.loadingDone = true;
    });

    var NodeMemoryUsage = $resource('/containers/dashboard/node-memory-usage');
    NodeMemoryUsage.get(function(response) {
      var data = response.data;
      vm.nodeMemoryUsage.data = data.nodeMemoryUsage;
      vm.nodeMemoryUsage.loadingDone = true;
    });

    vm.nodeHeatMapUsageLegendLabels = chartsDataMixin.nodeHeatMapUsageLegendLabels;
  }
]);

