angular.module('cfme.containers.providersModule').controller('containers.providerController', ['$scope','ChartsDataMixin', '$translate', '$resource', '$routeParams',
    function( $scope, chartsDataMixin, $translate, $resource, $routeParams ) {
      'use strict';

      // stash a ref to the controller object, and the various parent objects
      var vm = this;

      vm.chartHeight = chartsDataMixin.dashboardSparklineChartHeight;
      vm.dashboardHeatmapChartHeight = chartsDataMixin.dashboardHeatmapChartHeight;

      var currentId = $routeParams.id;
      if (typeof(currentId) === "undefined") {
          currentId = "openshift"
      }
      vm.navigaition = currentId;

      vm.providerCount = 0;
      vm.providerType = 'openshift';

      vm.getProviderTypeIconClass = function () {
        return 'pficon-' + vm.providerType;
      };
      vm.nodesStatus = {
        name: "Nodes",
        iconClass: "pficon-container-node",
        count: 0
      };
      vm.containersStatus = {
        name: "Containers",
        iconClass: "fa fa-cube",
        count: 0
      };
      vm.registriesStatus = {
        name:  "Registries",
        iconClass: "pficon-registry",
        count: 0
      };
      vm.projectsStatus = {
        name: "Projects",
        iconClass: "pficon-project",
        count: 0,
        href: "containers/projects"
      };
      vm.podsStatus = {
        name: "Pods",
        iconClass: "fa fa-cubes",
        count: 0,
        href: "containers/pods"
      };
      vm.servicesStatus = {
        name: "Services",
        iconClass: "pficon-service",
        count: 0
      };
      vm.imagesStatus = {
        name: "Images",
        iconClass: "pficon-image",
        count: 0
      };
      vm.routesStatus = {
        name: "Routes",
        iconClass: "pficon-route",
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
      var ContainersStatus = $resource('/containers/providers/status/' + currentId);
      ContainersStatus.get(function(response) {
        var data = response.data;
        vm.providerType = data.providers.type;
        vm.providerCount = data.providers.count;
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
