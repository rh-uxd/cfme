angular.module('cfme.containers.providersModule').controller('containers.providersController', ['$scope','$translate', '$resource', '$routeParams',
    function( $scope, $translate, $resource, $routeParams, panelValidation ) {
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
        $scope.cpuUsageConfig = chartConfig.cpuUsageConfig;
        $scope.memoryUsageConfig = chartConfig.memoryUsageConfig;
        $scope.storageUsageConfig = chartConfig.storageUsageConfig;
        $scope.networkUsageConfig = chartConfig.networkUsageConfig;

        $scope.cpuUsageData = {
            "used": 950,
            "total": 1000,
            "data": [
                712,
                725,
                729,
                710,
                740,
                742,
                750,
                825,
                829,
                810,
                840,
                842,
                850,
                825,
                829,
                810,
                940,
                942,
                950,
                925,
                929,
                910,
                940,
                942,
                950,
                925,
                929,
                910,
                940,
                950
            ],
            "dates": []
        };

        $scope.memoryUsageData = {
            used: 176,
            total: 432,
            data: [
                120,
                137,
                168,
                142,
                156,
                131,
                176,
                137,
                168,
                142,
                156,
                131,
                176,
                137,
                168,
                142,
                156,
                131,
                176,
                137,
                168,
                142,
                156,
                131,
                176,
                137,
                168,
                142,
                156,
                176
            ],
            dates: []
        };

        $scope.storageUsageData = {
            used: 1.1,
            total: 1.6,
            data: [
                0.3,
                0.35,
                0.65,
                0.72,
                1,
                1.1,
                0.35,
                0.65,
                0.72,
                1,
                1.1,
                0.35,
                0.65,
                0.72,
                1,
                1.1,
                0.35,
                0.65,
                0.72,
                1,
                1.1,
                0.35,
                0.65,
                0.72,
                1,
                1.1,
                0.35,
                0.65,
                0.72,
                1.1
            ],
            dates: []
        };

        $scope.networkUsageData = {
            used: 1100,
            total: 1300,
            data: [
                1100,
                1050,
                999,
                800,
                1025,
                1050,
                1100,
                1050,
                900,
                800,
                1025,
                1050,
                1100,
                1050,
                900,
                800,
                1025,
                1050,
                1100,
                1050,
                900,
                800,
                1025,
                1050,
                1100,
                1050,
                900,
                800,
                1025,
                1100
            ],
            dates: []
        };

        $scope.containerGroupTrends = {
            creations: [
                10,
                14,
                12,
                20,
                31,
                27,
                44,
                36,
                52,
                55,
                62,
                68,
                69,
                88,
                74,
                72,
                76,
                81,
                88,
                97,
                99,
                83,
                83,
                80,
                74,
                82,
                88,
                87,
                89,
                92
            ],
            deletions: [
                8,
                2,
                7,
                40,
                20,
                44,
                18,
                3,
                20,
                33,
                14,
                12,
                7,
                19,
                9,
                50,
                2,
                7,
                40,
                20,
                44,
                18,
                3,
                20,
                33,
                14,
                12,
                7,
                19,
                9
            ],
            "dates": []
        };

        $scope.imageCreations = {
            totalImages: [
                10,
                14,
                12,
                20,
                31,
                27,
                44,
                36,
                52,
                55,
                62,
                68,
                69,
                88,
                74,
                72,
                76,
                81,
                88,
                97,
                99,
                83,
                83,
                80,
                74,
                82,
                88,
                87,
                89,
                92
            ],
            totalSize: [
                8000,
                2000,
                7000,
                40000,
                20000,
                44000,
                18000,
                3000,
                20000,
                30003,
                14000,
                12000,
                7000,
                19000,
                9000,
                50000,
                2000,
                7000,
                40000,
                20000,
                44000,
                18000,
                3000,
                20000,
                33000,
                14000,
                12000,
                7000,
                19000,
                9000
            ],
            dates: []
        };

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
