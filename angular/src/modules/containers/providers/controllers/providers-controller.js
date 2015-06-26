angular.module('cfme.containers.providersModule').controller('containers.providersController', ['$scope','$translate',
    function( $scope, $translate, panelValidation ) {
        'use strict';

        // stash a ref to the controller object, and the various parent objects
        var vm = this;

        vm.navigaition = "Providers";

        vm.status_widgets = [ 
                { name: 'Nodes', iconClass: 'pficon-container-node', count: 25, status: [{iconClass: 'pficon-error-circle-o', count: 3}]},
                { name: 'Containers', iconClass: 'fa-cube', count: 180 },
                { name: 'Registries', iconClass: 'pficon-registry', count: 2 },
                { name: 'Projects', iconClass: 'pficon-project', count: 310 },
                { name: 'Container Groups', iconClass: 'fa-cubes', count: 700, status: [{iconClass: 'pficon-error-circle-o', count: 3}]},
                { name: 'Services', iconClass: 'pficon-service', count: 1000 },
                { name: 'Images', iconClass: 'pficon-image', count: 1250 },
                { name: 'Routes', iconClass: 'pficon-route', count: 125 }
            ];
        
        vm.providers = { name: 'Providers', count: 1, providers: [{iconClass: 'pficon-openshift', count: 1}]};

        $scope.cpuUsageConfig = {
            chartId: 'cpuUsageChart',
            title: 'CPU',
            total_units: 'MHz',
            usage_data_name: 'Used',
            legend_left_text: 'Last 30 Days',
            legend_right_text: '',
            num_days: 30
        };
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

        $scope.memoryUsageConfig = {
            chartId: 'memoryUsageChart',
            title: 'Memory',
            total_units: 'GB',
            usage_data_name: 'Used',
            legend_left_text: 'Last 30 Days',
            legend_right_text: '',
            num_days: 30
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

        $scope.storageUsageConfig = {
            chartId: 'storageUsageChart',
            title: 'Storage',
            total_units: 'TB',
            usage_data_name: 'Used',
            legend_left_text: 'Last 30 Days',
            legend_right_text: '',
            num_days: 30
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

        $scope.networkUsageConfig = {
            chartId: 'networkUsageChart',
            title: 'Network',
            total_units: 'Gbps',
            usage_data_name: 'Used',
            legend_left_text: 'Last 30 Days',
            legend_right_text: '',
            num_days: 30
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
    }
]);
