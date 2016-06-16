angular.module('miq.userAdminModule').controller('userAdmin.groupsController',
  ['$rootScope', '$scope', '$resource', '$location', 'ChartsDataMixin', 'ListUtils', 'ColumnsConfig',
  function($rootScope, $scope, $resource, $location, chartsDataMixin, listUtils, columnsConfig) {
    'use strict';

    $scope.listId = 'groupsList';

    var defaultRoleColumn = {
      columnType: 'labelValues',
      fields: [
        {
          label: 'Default Role',
          value: 'defaultRole'
        }
      ],
      titleWidth: 85,
      width: 230
    };
    var usersInfoColumn = {
      columnType: 'objectCount',
      infoField: 'usersInfo',
      width: columnsConfig.nameColumnWidth
    };

    $scope.columns = [
      listUtils.nameColumn,
      defaultRoleColumn,
      usersInfoColumn
    ];

    var matchesFilter = function (item, filter) {
      var match = true;

      if (filter.id === 'name') {
        match = item.name.match(filter.value) !== null;
      } else if (filter.id === 'defaultRole') {
        match = item.defaultRole.match(filter.value) !== null;
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
      $rootScope.groupsViewFilters = filters;
      $scope.groups = applyFilters($scope.allGroups, $scope.toolbarConfig.filterConfig);
    };

    var filterConfig = {
      fields: [
        {
          id: 'name',
          title: 'Group Name',
          placeholder: 'Filter by Group Name',
          filterType: 'text'
        },
        {
          id: 'defaultRole',
          title: 'Default Role',
          placeholder: 'Filter by Default Role',
          filterType: 'text'
        }
      ],
      resultsCount: 0,
      appliedFilters: [],
      onFilterChange: filterChange
    };

    var sortChange = function (sortId, isAscending) {
      listUtils.sortList($scope.groups, sortId, $scope.sortConfig.isAscending);
    };

    var nameSort = {
      id: 'name',
      title:  'Name',
      sortType: 'alpha'
    };

    var defaultRoleSort = {
      id: 'defaultRole',
      title:  'Default Role',
      sortType: 'alpha'
    };

    $scope.sortConfig = {
      fields: [
        nameSort,
        defaultRoleSort
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

    //Get the groups data
    $scope.groupsLoaded = false;
    var groups = $resource('/groups/all');
    groups.get(function(data) {
      $scope.allGroups = data.data;
      $scope.allGroups.forEach(function(group){
        group.usersInfo = {
          name: "Users",
          count: group.usersCount,
          iconClass: "fa fa-user"
        };
      });

      $scope.groups = listUtils.applyFilters($scope.allGroups, $scope.toolbarConfig.filterConfig);

      $scope.groupsLoaded = true;
    },
    function() {
      // Log an error
      $scope.groupsLoaded = true;
    });
  }
]);
