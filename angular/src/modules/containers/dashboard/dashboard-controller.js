angular.module('cfme.containers.dashboardModule').controller('containers.dashboardController', ['$scope','$translate', '$resource',
    function( $scope, $translate, $resource ) {
        'use strict';

        // stash a ref to the controller object, and the various parent objects
        var vm = this;

        vm.navigation = "containers";

        //Get the container data
        var ContainersStatus = $resource('/containers/dashboard/status');
        ContainersStatus.get(function(data) {
            vm.status_widgets = data.data.status;
            vm.providers = data.data.types;
        });

        //Utilization Charts

        vm.cpuUsageConfig = chartConfig.cpuUsageConfig;
        vm.memoryUsageConfig = chartConfig.memoryUsageConfig;

        //Call to get utilization data
        vm.utilizationLoadingDone = false;
        var ContainersUtilization = $resource('/containers/dashboard/utilization');
        ContainersUtilization.get(function(data) {
            var response = data.data;
            vm.cpuUsageData = response.cpuUsageData;
            vm.memoryUsageData = response.memoryUsageData;
            vm.utilizationLoadingDone = true;
        });

        vm.networkUtilizationCurrentConfig = chartConfig.currentNetworkUsageConfig;
        vm.networkUtilizationCurrentConfig.legend = {show: false};
        vm.networkUtilizationCurrentConfig.chartId = 'currentNetworkUtilizationChart';

        vm.networkUtilizationDailyConfig = chartConfig.dailyNetworkUsageConfig;
        vm.networkUtilizationDailyConfig.legend = {show: false};
        vm.networkUtilizationDailyConfig.chartId = 'dailyNetworkUtilizationChart';

        // Call to get network utilization
        vm.networkUtilizationLoadingDone = false;
        var networkUtilization = $resource('/containers/dashboard/utilization');
        networkUtilization.get(function(data) {
            console.dir(data.data);
            vm.currentNetworkUtilization = {
                creations: data.data.currentNetworkUsageData.data
            };
            vm.dailyNetworkUtilization = {
                creations: data.data.dailyNetworkUsageData.data
            };
            vm.networkUtilizationLoadingDone = true;
        });

        // Trends

        vm.podTrendConfig = chartConfig.podTrendConfig;
        vm.imageCreationsTrendConfig = chartConfig.imageCreationsTrendConfig;

        //Call to get pod trends data
        vm.podTrendsLoadingDone = false;
        var podTrends = $resource('/containers/dashboard/pods');
        podTrends.get(function(data) {
            vm.podTrends = data.data.podTrends;
            vm.podTrendsLoadingDone = true;
        });

        //Call to get image creations data
        vm.imageCreationsLoadingDone = false;
        var ImageCreations = $resource('/containers/dashboard/image-creations');
        ImageCreations.get(function(data) {
            vm.imageCreations = data.data.imageCreations;
            vm.imageCreationsLoadingDone = true;
        });

        // HeatMaps

        //Call to get node cpu usage data
        vm.nodeCpuUsageLoadingDone = false;
        var NodeCpuUsage = $resource('/containers/dashboard/node-cpu-usage');
        NodeCpuUsage.get(function(data) {
            vm.nodeCpuUsage = data.data.nodeCpuUsage;
            vm.nodeCpuUsageLoadingDone = true;
        });

        //Call to get node memory usage data
        vm.nodeMemoryUsageLoadingDone = false;
        var NodeMemoryUsage = $resource('/containers/dashboard/node-memory-usage');
        NodeMemoryUsage.get(function(data) {
            vm.nodeMemoryUsage = data.data.nodeMemoryUsage;
            vm.nodeMemoryUsageLoadingDone = true;
        });

        vm.nodeHeatMapUsageLegendLabels = ['< 70%', '70-80%' ,'80-90%', '> 90%'];

    }
]);
