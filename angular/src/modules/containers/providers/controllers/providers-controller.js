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
        ContainersStatus.get({id: currentId}, function(data) {
            vm.status_widgets = data.data.status;
            vm.providers = data.data.providers;
        });

        //Utilization Chart Config
        vm.cpuUsageConfig = chartConfig.cpuUsageConfig;
        vm.memoryUsageConfig = chartConfig.memoryUsageConfig;
        vm.storageUsageConfig = chartConfig.storageUsageConfig;
        vm.networkUsageConfig = chartConfig.networkUsageConfig;

        //Call to get utilization data
        vm.utilizationLoadingDone = false;
        var ContainersUtilization = $resource('/containers/dashboard/utilization');
        ContainersUtilization.get(function(data) {
            var response = data.data;
            vm.cpuUsageData = response.cpuUsageData;
            vm.memoryUsageData = response.memoryUsageData;
            vm.storageUsageData = response.storageUsageData;
            vm.networkUsageData = response.networkUsageData;
            vm.utilizationLoadingDone = true;
        });

        //Call to get container group trends data
        vm.containerGroupTrendsLoadingDone = false;
        var ContainersGroupTrends = $resource('/containers/dashboard/container-groups');
        ContainersGroupTrends.get(function(data) {
            vm.containerGroupTrends = data.data.containerGroupTrends;
            vm.containerGroupTrendsLoadingDone = true;
        });
        vm.containerGroupTrendLabels = ['Created','Deleted'];
        vm.containerGroupTrendTooltipSuffixes =['Container Group','Container Group'];

        //Call to get image creations data
        vm.imageCreationsLoadingDone = false;
        var ImageCreations = $resource('/containers/dashboard/image-creations');
        ImageCreations.get(function(data) {
            vm.imageCreations = data.data.imageCreations;
            vm.imageCreationsLoadingDone = true;
        });
        vm.imageCreationsTrendLabels = ['Images','Total Size'];
        vm.imageCreationsTrendTooltipSuffixes =['','GB'];

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

        //Call to get node storage usage data
        vm.nodeStorageUsageLoadingDone = false;
        var NodeStorageUsage = $resource('/containers/dashboard/node-storage-usage');
        NodeStorageUsage.get(function(data) {
            vm.nodeStorageUsage = data.data.nodeStorageUsage;
            vm.nodeStorageUsageLoadingDone = true;
        });

        //Call to get node network usage data
        vm.nodeNetworkUsageLoadingDone = false;
        var NodeNetworkUsage = $resource('/containers/dashboard/node-network-usage');
        NodeNetworkUsage.get(function(data) {
            vm.nodeNetworkUsage = data.data.nodeNetworkUsage;
            vm.nodeNetworkUsageLoadingDone = true;
        });

        vm.nodeHeatMapUsageLegendLabels = ['< 70%', '70-80%' ,'80-90%', '> 90%'];
        vm.nodeHeatMapNetworkLegendLabels = ['Very High','High','Low', 'Very Low'];
    }
]);
