angular.module('miq.containers.providersModule').controller('containers.providersController',
  ['$rootScope', '$scope', '$resource', '$location', 'ChartsDataMixin', 'ListUtils', 'pfViewUtils', '$routeParams',
  function($rootScope, $scope, $resource, $location, chartsDataMixin, listUtils, pfViewUtils, $routeParams) {
    'use strict';

    $scope.columns = [
      listUtils.providerColumn,
      listUtils.cpuCoresUsageColumn,
      listUtils.memoryGBUsageColumn,
      listUtils.nodesInfoColumn,
      listUtils.podsInfoColumn,
      listUtils.containersInfoColumn,
      listUtils.servicesInfoColumn,
      listUtils.registriesInfoColumn,
      listUtils.imagesInfoColumn,
      listUtils.projectsInfoColumn,
      listUtils.routesInfoColumn
    ];

    var initFilters = [];
    if ($routeParams.filter !== undefined) {
      initFilters.push({id: 'providerType', title: 'Provider Type', value: $routeParams.filter});
    }

    $scope.listId = 'containersProvidersList';
    var handleClick = function(item) {
      $location.path('/compute/containers/providers/provider/' + item.name);
    };

    var viewSelected = function(view) {
      $rootScope.providersViewType = view
    };

    var viewsConfig = {
      views: [pfViewUtils.getListView(), pfViewUtils.getCardView()],
      onViewSelect: viewSelected
    };

    var filterChange = function (filters) {
      $rootScope.providersViewFilters = filters;
      $scope.providers = listUtils.applyFilters($scope.allProviders, $scope.toolbarConfig.filterConfig);
    };

    var filterConfig = {
      fields: [
        listUtils.nameFilter,
        listUtils.providerTypeFilter
      ],
      resultsCount: 0,
      appliedFilters: initFilters,
      onFilterChange: filterChange
    };

    var sortChange = function (sortId, isAscending) {
      listUtils.sortList($scope.providers, sortId, $scope.sortConfig.isAscending);
    };

    $scope.sortConfig = {
      fields: [
        listUtils.nameSort,
        listUtils.providerTypeSort,
        listUtils.cpuUsageSort,
        listUtils.memoryUsageSort,
        listUtils.nodesSort,
        listUtils.podsSort,
        listUtils.containersSort,
        listUtils.servicesSort,
        listUtils.registriesSort,
        listUtils.imagesSort,
        listUtils.projectsSort,
        listUtils.routesSort
      ],
      onSortChange: sortChange
    };

    $scope.showDeploymentWizard = false;
    var doShowDeploymentWizard = function () {
      $rootScope.$emit('deployProvider.show');
    };

    $scope.actionsConfig = {
      primaryActions: [
        {
          name: "Deploy New Provider",
          title: "Deploy a new OpenShift provider",
          actionFn: doShowDeploymentWizard
        }
      ]
    };

    $scope.toolbarConfig = {
      viewsConfig: viewsConfig,
      filterConfig: filterConfig,
      sortConfig: $scope.sortConfig,
      actionsConfig: $scope.actionsConfig

    };

    if (!$rootScope.providersViewType) {
      $rootScope.providersViewType = $scope.toolbarConfig.viewsConfig.views[0].id;
    }
    $scope.toolbarConfig.viewsConfig.currentView = $rootScope.providersViewType;

    if ($rootScope.providersViewFilters) {
      $scope.toolbarConfig.filterConfig.appliedFilters = $rootScope.providersViewFilters;
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

    //Get the providers data
    $scope.providersLoaded = false;
    var providers = $resource('/containers/providers/all');
    providers.get(function(data) {
      $scope.allProviders = data.data;
      $scope.allProviders.forEach(function(provider){
        provider.providerName = provider.name;
        if (provider.providerType === 'openshift') {
          provider.providerIcon = 'pficon-openshift';
        }
        else {
          provider.providerIcon = 'pficon-kubernetes';
        }
        provider.cpuTitle = 'CPU Usage';
        provider.cpuUnits = 'MHz';
        provider.memoryTitle = 'Memory';
        provider.memoryUnits = 'GB';
        provider.layoutInline = {
          'type': 'inline'
        };
        provider.nodesInfo = {
          name: "Nodes",
          count: provider.nodes.count,
          iconClass: "fa fa-cubes"
        };
        provider.podsInfo = {
          name: "Pods",
          count: provider.pods.count,
          iconClass: "fa fa-cubes"
        };
        provider.containersInfo = {
          name: "Containers",
          count: provider.containers.count,
          iconClass: "fa fa-cube"
        };
        provider.servicesInfo = {
          name: "Services",
          count: provider.services.count,
          iconClass: "pficon-service"
        };
        provider.registriesInfo = {
          name: "Registries",
          count: provider.registries.count,
          iconClass: "pficon-registry"
        };
        provider.imagesInfo = {
          name: "Images",
          count: provider.images.count,
          iconClass: "pficon-image"
        };
        provider.projectsInfo = {
          name: "Projects",
          count: provider.projects.count,
          iconClass: "pficon-project"
        };
        provider.routesInfo = {
          name: "Routes",
          count: provider.routes.count,
          iconClass: "pficon-route"
        };
      });

      $scope.providers = listUtils.applyFilters($scope.allProviders, $scope.toolbarConfig.filterConfig);

      $scope.providersLoaded = true;
    });
  }
]);
