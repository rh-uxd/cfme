angular.module('cfme.containers.dashboardModule').controller('containers.dashboardController', ['$scope','$translate', '$resource',
    function( $scope, $translate, $resource, panelValidation ) {
        'use strict';

        // stash a ref to the controller object, and the various parent objects
        var vm = this;

        vm.navigaition = "containers";

        //Get the container data
        var ContainersStatus = $resource('/containers/dashboard/status');
        ContainersStatus.get(function(data) {
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

        // FAKE NODE USAGE FOR NOW
        var openShiftCount = 25;
        var kubernetesCount = 27;
        $scope.nodeCpuUsage = {
            data: randomizeData(openShiftCount, kubernetesCount)
        };
        $scope.nodeMemoryUsage = {
            data: randomizeData(openShiftCount, kubernetesCount)
        };
        $scope.nodeStorageUsage = {
            data: randomizeData(openShiftCount, kubernetesCount)
        };
        $scope.nodeNetworkUsage = {
            data: randomizeData(openShiftCount, kubernetesCount)
        };

        $scope.nodeHeatMapUsageLegendLabels = ['< 70%', '70-80%' ,'80-90%', '> 90%'];
        $scope.nodeHeatMapNetworkLegendLabels = ['Very High','High','Low', 'Very Low'];

    }
]);
