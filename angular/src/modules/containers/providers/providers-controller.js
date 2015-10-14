angular.module('miq.containers.providersModule').controller('containers.providersController',
  ['$rootScope', '$scope', '$resource', '$location', 'ChartsDataMixin', 'pfViewUtils', '$routeParams',
  function($rootScope, $scope, $resource, $location, chartsDataMixin, pfViewUtils, $routeParams) {
    'use strict';

    var initFilters = [];
    if ($routeParams.filter !== undefined) {
      initFilters.push({id: 'providerType', title: 'Provider Type', value: $routeParams.filter});
    }

    $scope.listId = 'containersProvidersList';
    var handleClick = function(item) {
      $location.path('/containers/providers/provider/' + item.name);
    };

    var viewSelected = function(view) {
      $rootScope.providersViewType = view
    };

    var viewsConfig = {
      views: [pfViewUtils.getListView(), pfViewUtils.getTilesView()],
      onViewSelect: viewSelected
    };

    var matchesFilter = function (provider, filter) {
      var match = true;

      if (filter.id === 'name') {
        match = provider.name.match(filter.value) !== null;
      } else if (filter.id === 'providerType') {
        match = provider.providerType.toLowerCase() === filter.value.toLowerCase();
      }
      return match;
    };

    var matchesFilters = function (provider, filters) {
      var matches = true;

      filters.forEach(function(filter) {
        if (!matchesFilter(provider, filter)) {
          matches = false;
          return false;
        }
      });
      return matches;
    };

    $scope.applyFilters = function (providers) {
      if ($scope.toolbarConfig.filterConfig.appliedFilters && $scope.toolbarConfig.filterConfig.appliedFilters.length > 0) {
        $scope.providers = [];
        $scope.allProviders.forEach(function (provider) {
         if (matchesFilters(provider, $scope.toolbarConfig.filterConfig.appliedFilters)) {
           $scope.providers.push(provider);
         }
        });
      } else {
        $scope.providers = providers;
      }
      $scope.toolbarConfig.filterConfig.resultsCount = $scope.providers.length;
    };

    var filterChange = function (filters) {
      $rootScope.providersViewFilters = filters;
      $scope.applyFilters($scope.allProviders);
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
          id: 'providerType',
          title:  'Provider Type',
          placeholder: 'Filter by Provider Type',
          filterType: 'select',
          filterValues: ['Kubernetes', 'OpenShift']
        }
      ],
      resultsCount: 0,
      appliedFilters: initFilters,
      onFilterChange: filterChange
    };

    $scope.toolbarConfig = {
      viewsConfig: viewsConfig,
      filterConfig: filterConfig
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
        if (provider.providerType === 'openshift') {
          provider.icon = 'pficon-openshift';
        }
        else {
          provider.icon = 'pficon-kubernetes';
        }
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

      $scope.applyFilters($scope.allProviders);

      $scope.providersLoaded = true;
    });
  }
]);
