angular.module('miq.infrastructure.providersModule').controller('infrastructure.providersController',
  ['$rootScope', '$scope', '$resource', '$location', 'ChartsDataMixin', 'ListUtils', 'pfViewUtils', '$routeParams', '$modal',
  function($rootScope, $scope, $resource, $location, chartsDataMixin, listUtils, pfViewUtils, $routeParams, $modal) {
    'use strict';

    $scope.columns = [
      listUtils.providerColumn,
      listUtils.cpuCoresUsageColumn,
      listUtils.memoryGBUsageColumn,
      listUtils.clustersInfoColumn,
      listUtils.hostsInfoColumn,
      listUtils.dataStoresInfoColumn,
      listUtils.vmsInfoColumn,
      listUtils.templatesInfoColumn
    ];

    var initFilters = [];
    if ($routeParams.filter !== undefined) {
      initFilters.push({id: 'providerType', title: 'Provider Type', value: $routeParams.filter});
    }

    $scope.listId = 'containersProvidersList';
    var handleClick = function(item) {
      $location.path('/compute/infrastructure/providers/provider/' + item.name);
    };

    var filterChange = function (filters) {
      $rootScope.providersViewFilters = filters;
      $scope.providers = listUtils.applyFilters($scope.allProviders, $scope.toolbarConfig.filterConfig);
    };

    var filterConfig = {
      fields: [
        listUtils.nameFilter
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
        listUtils.cpuUsageSort,
        listUtils.memoryUsageSort,
        listUtils.clustersSort,
        listUtils.hostsSort,
        listUtils.dataStoresSort,
        listUtils.vmsSort,
        listUtils.templatesSort
      ],
      onSortChange: sortChange
    };

    $scope.toolbarConfig = {
      filterConfig: filterConfig,
      sortConfig: $scope.sortConfig
    };

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
    var providers = $resource('/infrastructure/providers/status/all');
    providers.get(function(data) {
      $scope.allProviders = data.data;
      $scope.allProviders.forEach(function(provider){
        provider.providerName = provider.name;

        if (provider.providerType == 'vmware') {
          provider.providerImg = "styles/images/VMware-ESXi-Logo.png";
        } else if (provider.providerType == 'openshift') {
          provider.providerImg = "libraries/patternfly/dist/img/Openshift-Logo-Notext.svg";
        } else if (provider.providerType == 'kubernetes') {
          provider.providerImg = "libraries/patternfly/dist/img/kubernetes.svg";
        } else if (provider.providerType == 'atomic') {
          provider.providerImg = "libraries/patternfly/dist/img/RH_Atomic-Logo-NoText.svg";
        } else {
          provider.providerImg = ''
        }
        provider.cpuTitle = 'CPU Usage';
        provider.cpuUnits = 'MHz';
        provider.memoryTitle = 'Memory';
        provider.memoryUnits = 'GB';
        provider.layoutInline = {
          'type': 'inline'
        };
        provider.clustersInfo = {
          name: "Clusters",
          count: provider.clusters.count,
          iconClass: "pficon-cluster"
        };
        provider.hostsInfo = {
          name: "Hosts",
          count: provider.hosts.count,
          iconClass: "pficon-cluster"
        };
        provider.dataStoresInfo = {
          name: "DataStores",
          count: provider.datastores.count,
          iconClass: "fa fa-database"
        };
        provider.vmsInfo = {
          name: "VMs",
          count: provider.vms.count,
          iconClass: "pficon-screen"
        };
        provider.templatesInfo = {
          name: "Templates",
          count: provider.templates.count,
          iconClass: "pficon-screen"
        };
      });

      $scope.providers = listUtils.applyFilters($scope.allProviders, $scope.toolbarConfig.filterConfig);

      $scope.providersLoaded = true;
    });
  }
]);
