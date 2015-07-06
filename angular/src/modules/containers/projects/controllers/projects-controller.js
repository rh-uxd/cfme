angular.module('cfme.containers.projectsModule').controller('containers.projectsController', ['$scope','$translate', '$resource', '$routeParams',
    function( $scope, $translate, $resource, $routeParams, panelValidation ) {
        'use strict';

        // stash a ref to the controller object, and the various parent objects
        var vm = this;

        var currentId = $routeParams.id;
        if (typeof(currentId) === "undefined") {
            currentId = "openshift"
        }

        //This needs to come from a base request
        vm.navigaition = " ruby-webapp-1 :  My OpenShift Provider";

        //Get the container data
        var ContainersStatus = $resource('/containers/projects/status/:id');
        ContainersStatus.get({id: currentId}, function(data) {
            vm.status_widgets = data.data;
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

        //Get the container data
        var Quotas = $resource('/containers/projects/quotas/:id');
        Quotas.get({id: currentId}, function(data) {
            vm.quotas = data.data;
        });
    }
]);
