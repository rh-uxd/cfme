angular.module('cfme.containers.projectsModule').controller('containers.projectsController', ['$scope', '$resource', '$location', 'ChartsMixin',
    function($scope, $resource, $location, hartsMixin) {
        'use strict';

        // stash a ref to the controller object, and the various parent objects
        var vm = this;

        vm.donutConfig = {
            size: {
                width: 55,
                height: 55
            },
            donut: {
                width: 4
            }
        };

        vm.createUsageConfig = function(usageConfig) {
            var cpuUsageConfig = angular.copy(usageConfig);
            cpuUsageConfig.donutConfig = angular.copy(vm.donutConfig);
            return cpuUsageConfig;
        };

        //Get the projects data
        var projects = $resource('/containers/projects/all');
        projects.get(function(data) {
            vm.projects = data.data;
            vm.projects.forEach(function(project){
                if (project.provider.providerType === 'openshift') {
                    project.provider.icon = 'pficon-openshift';
                }
                else {
                    project.provider.icon = 'pficon-kubernetes';
                }
                project.cpuUsageConfig = vm.createUsageConfig(chartConfig.cpuUsageConfig);
                project.memoryUsageConfig = vm.createUsageConfig(chartConfig.memoryUsageConfig);
                project.storageUsageConfig = vm.createUsageConfig(chartConfig.storageUsageConfig);
                project.networkUsageConfig = vm.createUsageConfig(chartConfig.networkUsageConfig);
                project.podsInfo = {
                    name: "Pods",
                    count: project.pods,
                    iconClass: "fa-cubes"
                }
                project.servicesInfo = {
                    name: "Services",
                    count: project.services,
                    iconClass: "pficon-service"
                }
                project.routesInfo = {
                    name: "Routes",
                    count: project.routes,
                    iconClass: "pficon-route"
                }
                project.replicatorsInfo = {
                    name: "Replicators",
                    count: project.replicators,
                    iconClass: "fa-cubes"
                }
            });
        });

        vm.cpuIconClass = "icon-";
        vm.cpuIconContent = "&#xf0fc";
        vm.memoryIconClass = "icon-";
        vm.memoryIconContent = "&#xf0eb";
        vm.storageIconClass = "icon-";
        vm.storageIconContent = "&#xf1c0";
        vm.networkIconClass = "icon-";
        vm.networkIconContent = "&#xf0e8";

        $scope.selectItems = true;
        $scope.selectionMatchProp = 'uuid';
        $scope.selectedItems = [];
        $scope.checkDisabled = false;
        $scope.dblClick = function(item) {
            $location.path('/containers/projects/' + item.name);
        };
        $scope.multiSelect = false;

        vm.getUsageChartId = function(item) {
            console.log("usageChart" + item.uuid);
            return "usageChart" + item.uuid;
        }
        $scope.isSelected = function(item){
            var matchProp = $scope.selectionMatchProp;
            if ($scope.selectedItems.length) {
                return _.find($scope.selectedItems, function(itemObj){return itemObj[matchProp] === item[matchProp]; });
            }
            return false;
        };

        $scope.doListItemSelect = function(e, item){
            console.dir(item);
            if ($scope.selectItems && item){
                if ($scope.multiSelect && !$scope.dblClick){
                    var selectMatch = _.find($scope.selectedItems, function(itemObj){return itemObj === item;});
                    if (selectMatch) {
                        $scope.selectedItems = _.without($scope.selectedItems, selectMatch);
                    }
                    else {
                        $scope.selectedItems.push(item);
                    }
                }
                else {
                    if ($scope.selectedItems[0] === item) {
                        if (!$scope.dblClick) {
                            $scope.selectedItems = [];
                        }
                        return false;
                    }
                   $scope.selectedItems = [item];
                }
            }
            console.dir($scope.selectedItems);
        };
    }
]);
