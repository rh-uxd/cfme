angular.module('cfme.containers.projectsModule').controller('containers.projectsController', ['$scope', '$resource', '$location',
  function($scope, $resource, $location) {
    'use strict';

    // stash a ref to the controller object, and the various parent objects
    var vm = this;

    vm.listId = 'containersProjectsList';
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

    var handleClick = function(item) {
      $location.path('/containers/projects/' + item.name);
    };

    vm.listConfig = {
      selectItems: false,
      multiSelect: false,
      selectionMatchProp: 'name',
      selectedItems: [],
      checkDisabled: false,
      rowHeight: 64,
      onClick: handleClick
    }

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
          iconClass: "fa fa-cubes"
        };
        project.servicesInfo = {
          name: "Services",
          count: project.services,
          iconClass: "pficon-service"
        };
        project.routesInfo = {
          name: "Routes",
          count: project.routes,
          iconClass: "pficon-route"
        };
        project.replicatorsInfo = {
          name: "Replicators",
          count: project.replicators,
          iconClass: "fa fa-cubes"
        };
        project.cpuIconClass = "icon-";
        project.cpuIconContent = "&#xf0fc";
        project.memoryIconClass = "icon-";
        project.memoryIconContent = "&#xf0eb";
        project.storageIconClass = "icon-";
        project.storageIconContent = "&#xf1c0";
        project.networkIconClass = "icon-";
        project.networkIconContent = "&#xf0e8";

        project.menuItems = ["Do Something", "Do Something Else", "Print"];
      });
    });
  }
]);
