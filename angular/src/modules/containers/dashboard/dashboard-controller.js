angular.module('cfme.containers.dashboardModule').controller('containers.dashboardController', ['$scope','$translate', '$resource',
    function( $scope, $translate, $resource ) {
        'use strict';

        // stash a ref to the controller object, and the various parent objects
        var vm = this;

        vm.navigation = "containers";

        //Get the container data
        var ContainersStatus = $resource('/containers/dashboard/status');
        ContainersStatus.get(function(response) {
            var data = response.data;
            vm.status_widgets = data.status;
            vm.providers = data.types;
        });

        //Utilization Charts

        vm.cpuUsageConfig = chartConfig.cpuUsageConfig;
        vm.memoryUsageConfig = chartConfig.memoryUsageConfig;

        vm.utilizationLoadingDone = false;
        var ContainersUtilization = $resource('/containers/dashboard/utilization');
        ContainersUtilization.get(function(response) {
            var data = response.data;
            vm.cpuUsageData = data.cpuUsageData;
            vm.memoryUsageData = data.memoryUsageData;
            vm.utilizationLoadingDone = true;
        });

        vm.networkUtilizationCurrentConfig = chartConfig.currentNetworkUsageConfig;
        vm.networkUtilizationDailyConfig = chartConfig.dailyNetworkUsageConfig;

        // Call to get network utilization
        vm.networkUtilizationLoadingDone = false;
        var networkUtilization = $resource('/containers/dashboard/utilization');
        networkUtilization.get(function(response) {
            var data = response.data;
            vm.currentNetworkUtilization = data.currentNetworkUsageData;
            vm.dailyNetworkUtilization = data.dailyNetworkUsageData;
            vm.networkUtilizationLoadingDone = true;
        });

        // Trends

        vm.podTrendConfig = chartConfig.podTrendConfig;
        vm.podTrendsLoadingDone = false;
        var podTrends = $resource('/containers/dashboard/pods');
        podTrends.get(function(response) {
            var data = response.data;
            vm.podTrends = data.podTrends;
            vm.podTrendsLoadingDone = true;
        });

        vm.imageTrendConfig = chartConfig.imageTrendConfig;
        vm.imageTrendLoadingDone = false;
        var imageTrends = $resource('/containers/dashboard/image-trends');
        imageTrends.get(function(response) {
            var data = response.data;
            vm.imageTrends = data.imageTrends;
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

        vm.nodeHeatMapUsageLegendLabels = ['< 70%', '70-80%' ,'80-90%', '> 90%'];
    }
]);
