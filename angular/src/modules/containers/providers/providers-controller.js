angular.module('cfme.containers.providersModule').controller('containers.providersController', ['$scope','$translate', '$resource', '$routeParams',
    function( $scope, $translate, $resource, $routeParams ) {
        'use strict';

        // stash a ref to the controller object, and the various parent objects
        var vm = this;

        vm.navigaition = "Providers";

        var currentId = $routeParams.id;
        if (typeof(currentId) === "undefined") {
            currentId = "openshift"
        }

        //Get the container data
        var ContainersStatus = $resource('/containers/providers/status/:id');
        ContainersStatus.get({id: currentId}, function(response) {
            var data = response.data;
            vm.status_widgets = data.status;
            vm.providers = data.types;
        });

        //Utilization Chart Config
        vm.cpuUsageConfig = chartConfig.cpuUsageConfig;
        vm.memoryUsageConfig = chartConfig.memoryUsageConfig;

        //Call to get utilization data
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

        //Call to get node cpu usage data
        vm.nodeCpuUsageLoadingDone = false;
        var NodeCpuUsage = $resource('/containers/dashboard/node-cpu-usage');
        NodeCpuUsage.get(function(response) {
            var data = response.data;
            vm.nodeCpuUsage = data.nodeCpuUsage;
            vm.nodeCpuUsageLoadingDone = true;
        });

        //Call to get node memory usage data
        vm.nodeMemoryUsageLoadingDone = false;
        var NodeMemoryUsage = $resource('/containers/dashboard/node-memory-usage');
        NodeMemoryUsage.get(function(response) {
            var data = response.data;
            vm.nodeMemoryUsage = data.nodeMemoryUsage;
            vm.nodeMemoryUsageLoadingDone = true;
        });

        //Call to get node storage usage data
        vm.nodeStorageUsageLoadingDone = false;
        var NodeStorageUsage = $resource('/containers/dashboard/node-storage-usage');
        NodeStorageUsage.get(function(response) {
            var data = response.data;
            vm.nodeStorageUsage = data.nodeStorageUsage;
            vm.nodeStorageUsageLoadingDone = true;
        });

        //Call to get node network usage data
        vm.nodeNetworkUsageLoadingDone = false;
        var NodeNetworkUsage = $resource('/containers/dashboard/node-network-usage');
        NodeNetworkUsage.get(function(response) {
            var data = response.data;
            vm.nodeNetworkUsage = data.nodeNetworkUsage;
            vm.nodeNetworkUsageLoadingDone = true;
        });

        vm.nodeHeatMapUsageLegendLabels = ['< 70%', '70-80%' ,'80-90%', '> 90%'];
        vm.nodeHeatMapNetworkLegendLabels = ['Very High','High','Low', 'Very Low'];
    }
]);
