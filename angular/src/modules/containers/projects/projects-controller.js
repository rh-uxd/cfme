angular.module('miq.containers.projectsModule').controller('containers.projectsController', ['$rootScope', '$scope', '$resource', '$location', 'ChartsDataMixin', 'pfViewUtils',
  function($rootScope, $scope, $resource, $location, chartsDataMixin, pfViewUtils) {
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

    vm.createListUsageConfig = function(usageConfig) {
      var cpuUsageConfig = angular.copy(usageConfig);
      cpuUsageConfig.donutConfig = angular.copy(vm.donutConfig);
      return cpuUsageConfig;
    };

    var handleClick = function(item) {
      $location.path('/containers/projects/' + item.name);
    };

    var viewSelected = function(view) {
      console.log("View: " + view);
      $rootScope.projectsViewType = view
    };

    var viewsConfig = {
      views: [pfViewUtils.getListView(), pfViewUtils.getTilesView()],
      onViewSelect: viewSelected
    };

    var matchesFilter = function (project, filter) {
      var match = true;

      if (filter.id === 'name') {
        match = project.name.match(filter.value) !== null;
      } else if (filter.id === 'provider') {
        match = project.provider.name.match(filter.value) !== null;
      } else if (filter.id === 'providerType') {
        match = project.provider.providerType.toLowerCase() === filter.value.toLowerCase();
      }
      return match;
    };

    var matchesFilters = function (project, filters) {
      var matches = true;

      filters.forEach(function(filter) {
        if (!matchesFilter(project, filter)) {
          matches = false;
          return false;
        }
      });
      return matches;
    };

    vm.applyFilters = function (projects) {
      if (vm.toolbarConfig.filterConfig.appliedFilters && vm.toolbarConfig.filterConfig.appliedFilters.length > 0) {
        vm.projects = [];
        vm.allProjects.forEach(function (project) {
         if (matchesFilters(project, vm.toolbarConfig.filterConfig.appliedFilters)) {
           vm.projects.push(project);
         }
        });
      } else {
        vm.projects = projects;
      }
      vm.toolbarConfig.filterConfig.resultsCount = vm.projects.length;
    };

    var filterChange = function (filters) {
      $rootScope.projectsViewFilters = filters;
      vm.applyFilters(vm.allProjects);
    };

    var filterConfig = {
      fields: [
        {
          id: 'name',
          title:  'Name',
          placeholder: 'Filter by Name',
          filterType: 'text'
        },
        {
          id: 'provider',
          title:  'Provider',
          placeholder: 'Filter by Provider',
          filterType: 'text'
        },
        {
          id: 'providerType',
          title:  'Provider Type',
          placeholder: 'Filter by Provider Type',
          filterType: 'select',
          filterValues: ['Kubernetes', 'OpenShift']
        }
      ],
      resultsCount: 0,
      appliedFilters: [],
      onFilterChange: filterChange
    };

    vm.toolbarConfig = {
      viewsConfig: viewsConfig,
      filterConfig: filterConfig
    };

    if (!$rootScope.projectsViewType) {
      $rootScope.projectsViewType = vm.toolbarConfig.viewsConfig.views[0].id;
    }
    vm.toolbarConfig.viewsConfig.currentView = $rootScope.projectsViewType;

    if ($rootScope.projectsViewFilters) {
      vm.toolbarConfig.filterConfig.appliedFilters = $rootScope.projectsViewFilters;
    }

    vm.listConfig = {
      selectItems: false,
      multiSelect: false,
      selectionMatchProp: 'name',
      selectedItems: [],
      checkDisabled: false,
      rowHeight: 64,
      onClick: handleClick
    };

    //Get the projects data
    vm.projectsLoaded = false;
    var projects = $resource('/containers/projects/all');
    projects.get(function(data) {
      vm.allProjects = data.data;
      vm.allProjects.forEach(function(project){
        if (project.provider.providerType === 'openshift') {
          project.provider.icon = 'pficon-openshift';
        }
        else {
          project.provider.icon = 'pficon-kubernetes';
        }

        project.cpuUsageConfig = {
          'chartId': project.name + '_cpuUsageChart',
          'title': 'CPU Utilization',
          'units': 'Cores',
          'usageDataName': 'Used',
          'legendLeftText': 'Last 30 Days',
          'legendRightText': '',
          'numDays': 30
        };
        project.cpuUsageSparklineConfig = {
          chartId: project.name + '_cpuSparklineChart'
        };
        project.cpuUsageDonutConfig = {
          chartId: project.name + '_cpuDonutChart',
          donut: {
            width: 12
          },
          size: {
            height: 125
          }
        };
        project.cpuListUsageConfig = vm.createListUsageConfig(chartConfig.cpuUsageConfig);
        project.cpuUsageData = chartsDataMixin.getCpuUsageDataFromData(project, project.cpuUsageConfig.usageDataName);
        project.memoryListUsageConfig = vm.createListUsageConfig(chartConfig.memoryUsageConfig);
        project.storageListUsageConfig = vm.createListUsageConfig(chartConfig.storageUsageConfig);
        project.networkListUsageConfig = vm.createListUsageConfig(chartConfig.networkUsageConfig);
        project.podsInfo = {
          name: "Pods",
          count: project.pods,
          iconClass: "fa fa-cubes"
        };
        project.containersInfo = {
          name: "Containers",
          count: project.containers,
          iconClass: "fa fa-cube"
        };
        project.routesInfo = {
          name: "Routes",
          count: project.routes,
          iconClass: "pficon-route"
        };
        project.servicesInfo = {
          name: "Services",
          count: project.services,
          iconClass: "pficon-service"
        };
        project.imagesInfo = {
          name: "Images",
          count: project.images,
          iconClass: "pficon-image"
        };
        project.registriesInfo = {
          name: "Registries",
          count: project.registries,
          iconClass: "pficon-registry"
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

      vm.applyFilters(vm.allProjects);

      vm.projectsLoaded = true;
    });
  }
]);
