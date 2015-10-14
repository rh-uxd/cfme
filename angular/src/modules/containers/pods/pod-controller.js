angular.module('miq.containers.podsModule').controller('containers.podController', ['$scope', 'ChartsDataMixin', '$translate', '$resource', '$routeParams',
  function( $scope, chartsDataMixin, $translate, $resource, $routeParams ) {
    'use strict';

    $scope.chartHeight = chartsDataMixin.dashboardSparklineChartHeight;
    $scope.dashboardHeatmapChartHeight = chartsDataMixin.dashboardHeatmapChartHeight;

    var currentId = $routeParams.id;
    if (typeof(currentId) === "undefined") {
      currentId = "openshift"
    }

    //This needs to come from a base request
    $scope.navigation = currentId;

    // Node Utilization
    $scope.cpuUsageConfig = chartConfig.podCpuUsageConfig;
    $scope.cpuUsageSparklineConfig = {
      tooltipType: 'valuePerDay',
      chartId: 'cpuSparklineChart'
    };
    $scope.cpuUsageDonutConfig = {
      chartId: 'cpuDonutChart',
      thresholds: {'warning':'60','error':'90'}
    };
    $scope.memoryUsageConfig = chartConfig.podMemoryUsageConfig;
    $scope.memoryUsageSparklineConfig = {
      tooltipType: 'valuePerDay',
      chartId: 'memorySparklineChart'
    };
    $scope.memoryUsageDonutConfig = {
      chartId: 'memoryDonutChart',
      thresholds: {'warning':'60','error':'90'}
    };

    $scope.containersStatus = {
      title: "Containers",
      iconClass: "fa fa-cube",
      count: 3
    };
    $scope.imagesStatus = {
      title: "Images",
      iconClass: "pficon pficon-image",
      count: 3
    };
    $scope.servicesStatus = {
      title: "Services",
      iconClass: "pficon pficon-service",
      count: 2
    };

    $scope.left_metrics = [
      {title: 'Uptime', value: '02:31:54'},
      {title: 'Node', value: 'My Node'},
      {title: 'Replicator', value: 'Default Replicator'},
      {title: 'CPU Used (mc)', value: '11 milliCores'},
      {title: 'Memory Page Faults', value: 201},
      {title: 'Memory Major Page Faults', value: 3},
      {title: 'Network Received', value: 712},
      {title: 'Network Sent', value: 192},
      {title: '# Network Errors', value: 31},
      {title: 'File System Used', value: '192 GB'},
    ];
    $scope.right_metrics = [
    ];

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

    $scope.networkUtilizationDailyConfig = chartConfig.podDailyNetworkUsageConfig;
    $scope.networkUtilizationDailyConfig.tooltipFn = chartsDataMixin.sparklineHourTooltip;

    $scope.networkUtilizationLoadingDone = false;
    var networkUtilization = $resource('/containers/pods/utilization');
    networkUtilization.get(function(response) {
      var data = response.data;
      $scope.currentNetworkUtilization = chartsDataMixin.getSparklineData(data.currentNetworkUsageData, $scope.networkUtilizationCurrentConfig.dataName, 60);
      chartsDataMixin.continuouslyUpdateData($scope.currentNetworkUtilization, 60 * 1000);
      $scope.dailyNetworkUtilization = chartsDataMixin.getSparklineData(data.hourlyNetworkUsageData, $scope.networkUtilizationDailyConfig.dataName, 60 * 60);
      $scope.networkUtilizationLoadingDone = true;
    });

    var filterChange = function (filters) {
      $rootScope.podsViewFilters = filters;
      $scope.applyFilters($scope.allPods);
    };

    $scope.filterConfig = {
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
      if ($scope.sortConfig.currentField.id === 'name') {
        compValue = item1.name.localeCompare(item2.name);
      } else if ($scope.sortConfig.currentField.id === 'uptime') {
        compValue = item1.uptime.localeCompare(item2.uptime);
      } else if ($scope.sortConfig.currentField.id === 'cpuUsage') {
        compValue = item1.milliCoresUsed - item2.milliCoresUsed;
      } else if ($scope.sortConfig.currentField.id === 'memoryUsage') {
        compValue = item1.memoryUsed - item2.memoryUsed;
      }

      if (!$scope.sortConfig.isAscending) {
        compValue = compValue * -1;
      }

      return compValue;
    };

    var sortChange = function (sortId, isAscending) {
      if ($scope.containers && $scope.containers.length > 0) {
        $scope.containers.sort(compareFn);
      }
    };

    $scope.sortConfig = {
      fields: [
        {
          id: 'name',
          title:  'Name',
          sortType: 'alpha'
        },
        {
          id: 'uptime',
          title:  'Uptime',
          sortType: 'numeric'
        },
        {
          id: 'cpuUsage',
          title:  'CPU Used',
          sortType: 'numeric'
        },
        {
          id: 'memoryUsage',
          title:  'Memory Used',
          sortType: 'numeric'
        }
      ],
      onSortChange: sortChange
    };

    $scope.toolbarConfig = {
//      filterConfig: $scope.filterConfig,
      sortConfig: $scope.sortConfig
    };

    $scope.listConfig = {
      selectItems: false,
      multiSelect: false,
      showSelectBox: false
    };

    //Get the containers data
    $scope.containersLoaded = false;
    var containers = $resource('/containers/pods/containers');
    containers.get(function(data) {
      $scope.containers = data.data;
      $scope.containersLoaded = true
    });
  }
]);
