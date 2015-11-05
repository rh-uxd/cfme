angular.module('miq.containers.podsModule').controller('containers.podsController',
  ['$rootScope', '$scope', '$resource', '$location', 'ChartsDataMixin', 'ListUtils', 'pfViewUtils',
  function($rootScope, $scope, $resource, $location, chartsDataMixin, listUtils, pfViewUtils) {
    'use strict';

    $scope.listId = 'containersPodsList';

    $scope.columns = [
      listUtils.nameColumn,
      listUtils.uptimeColumn,
      listUtils.cpuMilliCoresUsageColumn,
      listUtils.memoryMBUsageColumn,
      listUtils.containersInfoColumn,
      listUtils.imagesInfoColumn,
      listUtils.servicesInfoColumn
    ];


    var handleClick = function(item) {
      $location.path('/containers/pods/' + item.name);
    };

    var viewSelected = function(view) {
      $rootScope.podsViewType = view
    };

    $scope.viewsConfig = {
      views: [pfViewUtils.getListView(), pfViewUtils.getTilesView()],
      onViewSelect: viewSelected
    };

    var filterChange = function (filters) {
      $rootScope.podsViewFilters = filters;
      $scope.pods = listUtils.applyFilters($scope.allPods, $scope.toolbarConfig.filterConfig);
    };

    var filterConfig = {
      fields: [
        listUtils.nameFilter
      ],
      resultsCount: 0,
      appliedFilters: [],
      onFilterChange: filterChange
    };

    var sortChange = function (sortId, isAscending) {
      listUtils.sortList($scope.pods, sortId, $scope.sortConfig.isAscending);
    };

    $scope.sortConfig = {
      fields: [
        listUtils.nameSort,
        listUtils.uptimeSort,
        listUtils.cpuUsageSort,
        listUtils.memoryUsageSort,
        listUtils.containersSort,
        listUtils.imagesSort,
        listUtils.servicesSort
      ],
      onSortChange: sortChange
    };

    $scope.toolbarConfig = {
      viewsConfig: $scope.viewsConfig,
      filterConfig: filterConfig,
      sortConfig: $scope.sortConfig
    };

    if (!$rootScope.podsViewType) {
      $rootScope.podsViewType = $scope.viewsConfig.views[0].id;
    }
    $scope.viewsConfig.currentView = $rootScope.podsViewType;

    if ($rootScope.podsViewFilters) {
      $scope.toolbarConfig.filterConfig.appliedFilters = $rootScope.podsViewFilters;
    }

    $scope.listConfig = {
      selectItems: false,
      multiSelect: false,
      selectionMatchProp: 'name',
      selectedItems: [],
      rowHeight: 64,
      checkDisabled: false,
      onClick: handleClick
    };

    //Get the pods data
    $scope.podsLoaded = false;
    var pods = $resource('/containers/pods/all');
    pods.get(function(data) {
      $scope.allPods = data.data;
      $scope.allPods.forEach(function(pod){
        pod.cpuUsageData = {
          used: pod.milliCoresUsed,
          total: pod.milliCoresTotal
        };
        pod.memoryUsageData = {
          used: pod.memoryUsed,
          total: pod.memoryTotal
        };
        pod.cpuTitle = 'CPU Usage';
        pod.cpuUnits = 'MHz';
        pod.memoryTitle = 'Memory';
        pod.memoryUnits = 'GB';
        pod.layoutInline = {
          'type': 'inline'
        };
        pod.containersInfo = {
          name: "Containers",
          count: pod.containersCount,
          iconClass: "fa fa-cube"
        };
        pod.imagesInfo = {
          name: "Images",
          count: pod.imagesCount,
          iconClass: "pficon-image"
        };
        pod.servicesInfo = {
          name: "Services",
          count: pod.servicesCount,
          iconClass: "pficon-service"
        };
      });
      $scope.pods = listUtils.applyFilters($scope.allPods, $scope.toolbarConfig.filterConfig);
      $scope.podsLoaded = true
    });
  }
]);
