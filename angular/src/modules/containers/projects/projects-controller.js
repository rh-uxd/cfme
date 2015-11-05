angular.module('miq.containers.projectsModule').controller('containers.projectsController',
  ['$rootScope', '$scope', '$resource', '$location', 'ChartsDataMixin', 'ListUtils', 'pfViewUtils',
  function($rootScope, $scope, $resource, $location, chartsDataMixin, listUtils, pfViewUtils) {
    'use strict';

    $scope.listId = 'containersProjectsList';

    $scope.columns = [
      listUtils.nameColumn,
      listUtils.providerColumn,
      listUtils.cpuCoresUsageColumn,
      listUtils.memoryGBUsageColumn,
      listUtils.podsInfoColumn,
      listUtils.containersInfoColumn,
      listUtils.routesInfoColumn,
      listUtils.servicesInfoColumn,
      listUtils.imagesInfoColumn,
      listUtils.registriesInfoColumn
    ];

    $scope.donutConfig = {
      size: {
        width: 55,
        height: 55
      },
      donut: {
        width: 4
      }
    };

    $scope.createListUsageConfig = function(usageConfig) {
      var cpuUsageConfig = angular.copy(usageConfig);
      cpuUsageConfig.donutConfig = angular.copy($scope.donutConfig);
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

    var filterChange = function (filters) {
      $rootScope.projectsViewFilters = filters;
      $scope.projects = listUtils.applyFilters($scope.allProjects, $scope.toolbarConfig.filterConfig);
    };

    var filterConfig = {
      fields: [
        listUtils.nameFilter,
        listUtils.providerFilter,
        listUtils.providerTypeFilter
      ],
      resultsCount: 0,
      appliedFilters: [],
      onFilterChange: filterChange
    };

    var sortChange = function (sortId, isAscending) {
      listUtils.sortList($scope.projects, sortId, $scope.sortConfig.isAscending);
    };

    $scope.sortConfig = {
      fields: [
        listUtils.nameSort,
        listUtils.providerSort,
        listUtils.providerTypeSort,
        listUtils.cpuUsageSort,
        listUtils.memoryUsageSort,
        listUtils.podsSort,
        listUtils.containersSort,
        listUtils.routesSort,
        listUtils.servicesSort,
        listUtils.imagesSort,
        listUtils.registriesSort
      ],
      onSortChange: sortChange
    };

    $scope.toolbarConfig = {
      viewsConfig: viewsConfig,
      filterConfig: filterConfig,
      sortConfig: $scope.sortConfig
    };

    if (!$rootScope.projectsViewType) {
      $rootScope.projectsViewType = $scope.toolbarConfig.viewsConfig.views[0].id;
    }
    $scope.toolbarConfig.viewsConfig.currentView = $rootScope.projectsViewType;

    if ($rootScope.projectsViewFilters) {
      $scope.toolbarConfig.filterConfig.appliedFilters = $rootScope.projectsViewFilters;
    }

    $scope.listConfig = {
      selectItems: false,
      multiSelect: false,
      selectionMatchProp: 'name',
      selectedItems: [],
      checkDisabled: false,
      rowHeight: 64,
      onClick: handleClick
    };

    //Get the projects data
    $scope.projectsLoaded = false;
    var projects = $resource('/containers/projects/all');
    projects.get(function(data) {
      $scope.allProjects = data.data;
      $scope.allProjects.forEach(function(project){
        project.providerName = project.provider.name;
        project.providerType = project.provider.providerType;
        if (project.providerType === 'openshift') {
          project.providerIcon = 'pficon-openshift';
        }
        else {
          project.providerIcon = 'pficon-kubernetes';
        }

        project.cpuTitle = 'CPU Usage';
        project.cpuUnits = 'MHz';
        project.memoryTitle = 'Memory';
        project.memoryUnits = 'GB';
        project.layoutInline = {
          'type': 'inline'
        };

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
        project.cpuListUsageConfig = $scope.createListUsageConfig(chartConfig.cpuUsageConfig);
        project.cpuUsageData = chartsDataMixin.getCpuUsageDataFromData(project, project.cpuUsageConfig.usageDataName);
        project.memoryListUsageConfig = $scope.createListUsageConfig(chartConfig.memoryUsageConfig);
        project.storageListUsageConfig = $scope.createListUsageConfig(chartConfig.storageUsageConfig);
        project.networkListUsageConfig = $scope.createListUsageConfig(chartConfig.networkUsageConfig);
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

      $scope.projects = listUtils.applyFilters($scope.allProjects, $scope.toolbarConfig.filterConfig);

      $scope.projectsLoaded = true;
    });
  }
]);
