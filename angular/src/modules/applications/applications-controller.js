angular.module('miq.applicationsModule').controller('applicationsController',
  ['$rootScope', '$scope', '$resource', '$location', 'ChartsDataMixin', 'ListUtils', 'pfViewUtils',
  function($rootScope, $scope, $resource, $location, chartsDataMixin, listUtils, pfViewUtils) {
    'use strict';

    $scope.listId = 'applicationsList';

    $scope.columns = [
      listUtils.nameColumn,
      listUtils.cpuUsedPercentColumn,
      listUtils.memoryMBUsageColumn,
      listUtils.sessionsInfoColumn,
      listUtils.servicesInfoColumn,
      listUtils.serverGroupsInfoColumn
    ];

    var matchesFilter = function (item, filter) {
      var match = true;

      if (filter.id === 'name') {
        match = item.name.match(filter.value) !== null;
      }
      return match;
    };

    var matchesFilters = function (item, filters) {
      var matches = true;

      filters.forEach(function(filter) {
        if (!matchesFilter(item, filter)) {
          matches = false;
          return false;
        }
      });
      return matches;
    };

    var applyFilters = function (items, filterConfig) {
      var filteredItems = items;
      if (filterConfig.appliedFilters && filterConfig.appliedFilters.length > 0) {
        filteredItems = [];
        items.forEach(function (item) {
          if (matchesFilters(item, filterConfig.appliedFilters)) {
            filteredItems.push(item);
          }
        });
      }

      filterConfig.resultsCount = filteredItems.length;
      return filteredItems;
    };

    var filterChange = function (filters) {
      $rootScope.applicationsViewFilters = filters;
      $scope.applications = applyFilters($scope.allApplications, $scope.toolbarConfig.filterConfig);
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
      listUtils.sortList($scope.applications, sortId, $scope.sortConfig.isAscending);
    };

    var sessionsSort = {
      id: 'sessionsCount',
      title:  'Sessions',
      sortType: 'numeric'
    };

    var groupsSort = {
      id: 'groupsCount',
      title:  'Server Groups',
      sortType: 'numeric'
    };

    $scope.sortConfig = {
      fields: [
        listUtils.nameSort,
        listUtils.cpuPercentUsedSort,
        listUtils.memoryUsageSort,
        sessionsSort,
        listUtils.servicesSort,
        groupsSort
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
      rowHeight: 64
    };

    //Get the applications data
    $scope.applicationsLoaded = false;
    var applications = $resource('/applications/empty');
    applications.get(function(data) {
      $scope.allApplications = data.data;
      $scope.allApplications.forEach(function(application){

        application.memoryUsageData = {
          used: application.memoryUsed,
          total: application.memoryTotal
        };

        application.servicesInfo = {
          name: "Services",
          count: application.servicesCount,
          iconClass: "pficon-service"
        };
        application.sessionsInfo = {
          name: "Sessions",
          count: application.sessionsCount,
          iconClass: "pficon-user"
        };
        application.serverGroupsInfo = {
          name: "Server Groups",
          count: application.groupsCount,
          iconClass: "pficon-registry"
        };
      });

      $scope.applications = listUtils.applyFilters($scope.allApplications, $scope.toolbarConfig.filterConfig);

      $scope.applicationsLoaded = true;
    });
  }
]);
