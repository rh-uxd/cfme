angular.module('cfme.containers.dashboardModule').controller('containers.dashboardController', ['$scope', 'ChartsDataMixin', '$translate', '$resource',
    function( $scope, chartsDataMixin, $translate, $resource ) {
        'use strict';

        // stash a ref to the controller object, and the various parent objects
        var vm = this;

        vm.navigation = "containers";

        vm.chartHeight = chartsDataMixin.dashboardSparklineChartHeight;
        vm.dashboardHeatmapChartHeight = chartsDataMixin.dashboardHeatmapChartHeight;

        //Get the container data
        var ContainersStatus = $resource('/containers/dashboard/status');
        ContainersStatus.get(function(response) {
            var data = response.data;
            vm.status_widgets = data.status;
            vm.providers = data.types;
        });

        // Node Utilization

        vm.cpuUsageConfig = chartConfig.cpuUsageConfig;
        vm.memoryUsageConfig = chartConfig.memoryUsageConfig;

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

        vm.nodeCpuUsageLoadingDone = false;
        var NodeCpuUsage = $resource('/containers/dashboard/node-cpu-usage');
        NodeCpuUsage.get(function(response) {
            var data = response.data;
            vm.nodeCpuUsage = data.nodeCpuUsage;
            vm.nodeCpuUsageLoadingDone = true;
        });

        vm.nodeMemoryUsageLoadingDone = false;
        var NodeMemoryUsage = $resource('/containers/dashboard/node-memory-usage');
        NodeMemoryUsage.get(function(response) {
            var data = response.data;
            vm.nodeMemoryUsage = data.nodeMemoryUsage;
            vm.nodeMemoryUsageLoadingDone = true;
        });

        vm.nodeHeatMapUsageLegendLabels = chartsDataMixin.nodeHeatMapUsageLegendLabels;
    }
]);
