angular.module('cfme.containers.providersModule').controller('containers.providersController',
  ['$rootScope', '$scope', '$resource', '$location', 'ChartsDataMixin', 'pfViewUtils', '$routeParams',
  function($rootScope, $scope, $resource, $location, chartsDataMixin, pfViewUtils, $routeParams) {
    'use strict';

    // stash a ref to the controller object, and the various parent objects
    var vm = this;

    var initFilters = [];
    if ($routeParams.filter !== undefined) {
      initFilters.push({id: 'providerType', title: 'Provider Type', value: $routeParams.filter});
    }

    vm.listId = 'containersProvidersList';
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

    vm.applyFilters = function (providers) {
      if (vm.toolbarConfig.filterConfig.appliedFilters && vm.toolbarConfig.filterConfig.appliedFilters.length > 0) {
        vm.providers = [];
        vm.allProviders.forEach(function (provider) {
         if (matchesFilters(provider, vm.toolbarConfig.filterConfig.appliedFilters)) {
           vm.providers.push(provider);
         }
        });
      } else {
        vm.providers = providers;
      }
      vm.toolbarConfig.filterConfig.resultsCount = vm.providers.length;
    };

    var filterChange = function (filters) {
      $rootScope.providersViewFilters = filters;
      vm.applyFilters(vm.allProviders);
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

    vm.toolbarConfig = {
      viewsConfig: viewsConfig,
      filterConfig: filterConfig
    };

    if (!$rootScope.providersViewType) {
      $rootScope.providersViewType = vm.toolbarConfig.viewsConfig.views[0].id;
    }
    vm.toolbarConfig.viewsConfig.currentView = $rootScope.providersViewType;

    if ($rootScope.providersViewFilters) {
      vm.toolbarConfig.filterConfig.appliedFilters = $rootScope.providersViewFilters;
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

    //Get the providers data
    vm.providersLoaded = false;
    var providers = $resource('/containers/providers/all');
    providers.get(function(data) {
      vm.allProviders = data.data;
      vm.allProviders.forEach(function(provider){
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

      vm.applyFilters(vm.allProviders);

      vm.providersLoaded = true;
    });
  }
]);
