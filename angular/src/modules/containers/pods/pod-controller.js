angular.module('cfme.containers.podsModule').controller('containers.podController', ['$scope', 'ChartsDataMixin', '$translate', '$resource', '$routeParams',
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

    //This needs to come from a base request
    vm.navigation = currentId;

    // Node Utilization
    vm.cpuUsageConfig = chartConfig.podCpuUsageConfig;
    vm.cpuUsageSparklineConfig = {
      chartId: 'cpuSparklineChart'
    };
    vm.cpuUsageDonutConfig = {
      chartId: 'cpuDonutChart',
      thresholds: {'warning':'60','error':'90'}
    };
    vm.memoryUsageConfig = chartConfig.podMemoryUsageConfig;
    vm.memoryUsageSparklineConfig = {
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
      vm.currentNetworkUtilization = chartsDataMixin.getSparklineData(data.currentNetworkUsageData, vm.networkUtilizationCurrentConfig.dataName, true);
      chartsDataMixin.continuouslyUpdateData(vm.currentNetworkUtilization, 10 * 1000);
      vm.dailyNetworkUtilization = chartsDataMixin.getSparklineData(data.dailyNetworkUsageData, vm.networkUtilizationDailyConfig.dataName);
      vm.networkUtilizationLoadingDone = true;
    });

    var filterChange = function (filters) {
      $rootScope.podsViewFilters = filters;
      vm.applyFilters(vm.allPods);
    };

    vm.filterConfig = {
      fields: [
        {
          id: 'name',
          title:  'Name',
          placeholder: 'Filter by Name',
          filterType: 'text'
        }
      ],
      resultsCount: 0,
      appliedFilters: [],
      onFilterChange: filterChange
    };

    var compareFn = function(item1, item2) {
      var compValue = 0;
      if (vm.sortConfig.currentField.id === 'name') {
        compValue = item1.name.localeCompare(item2.name);
      } else if (vm.sortConfig.currentField.id === 'uptime') {
        compValue = item1.uptime.localeCompare(item2.uptime);
      } else if (vm.sortConfig.currentField.id === 'cpuUsage') {
        compValue = item1.milliCoresUsed - item2.milliCoresUsed;
      } else if (vm.sortConfig.currentField.id === 'cpuUsage') {
        compValue = item1.memoryUsed - item2.memoryUsed;
      }

      if (!vm.sortConfig.isAscending) {
        compValue = compValue * -1;
      }

      return compValue;
    };

    var sortChange = function (sortId, isAscending) {
      if (vm.containers && vm.containers.length > 0) {
        vm.containers.sort(compareFn);
      }
    };

    vm.sortConfig = {
      fields: [
        {
          id: 'name',
          title:  'Name',
          sortType: 'alpha'
        },
        {
          id: 'uptime',
          title:  'Up Time',
          sortType: 'numeric'
        },
        {
          id: 'cpuUsage',
          title:  'CPU Usage',
          sortType: 'numeric'
        },
        {
          id: 'memoryUsage',
          title:  'Memory Usage',
          sortType: 'numeric'
        }
      ],
      onSortChange: sortChange
    };

    vm.toolbarConfig = {
//      filterConfig: vm.filterConfig,
      sortConfig: vm.sortConfig
    };

    vm.listConfig = {
      selectItems: false,
      multiSelect: false,
      showSelectBox: false
    };

    //Get the containers data
    vm.containersLoaded = false;
    var containers = $resource('/containers/pods/all');
    containers.get(function(data) {
      vm.containers = data.data;
      vm.containersLoaded = true
    });
  }
]);
