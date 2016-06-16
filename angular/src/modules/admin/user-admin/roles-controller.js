angular.module('miq.userAdminModule').controller('userAdmin.rolesController',
  ['$rootScope', '$scope', '$resource', '$location', 'ChartsDataMixin', 'ListUtils', 'ColumnsConfig',
  function($rootScope, $scope, $resource, $location, chartsDataMixin, listUtils, columnsConfig) {
    'use strict';

    $scope.listId = 'rolesList';

    var usersInfoColumn = {
      columnType: 'objectCount',
      infoField: 'usersInfo',
      width: columnsConfig.nameColumnWidth
    };

    var permissionsInfoColumn = {
      columnType: 'objectCount',
      infoField: 'permissionsInfo',
      width: columnsConfig.nameColumnWidth
    };

    $scope.columns = [
      listUtils.nameColumn,
      usersInfoColumn,
      permissionsInfoColumn
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
      $rootScope.rolesViewFilters = filters;
      $scope.roles = applyFilters($scope.allRoles, $scope.toolbarConfig.filterConfig);
    };

    var filterConfig = {
      fields: [
        {
          id: 'name',
          title: 'Role Name',
          placeholder: 'Filter by Role Name',
          filterType: 'text'
        }
      ],
      resultsCount: 0,
      appliedFilters: [],
      onFilterChange: filterChange
    };

    var sortChange = function (sortId, isAscending) {
      listUtils.sortList($scope.roles, sortId, $scope.sortConfig.isAscending);
    };

    var nameSort = {
      id: 'name',
      title:  'Name',
      sortType: 'alpha'
    };

    var usersSort = {
      id: 'usersCount',
      title:  'Users',
      sortType: 'numeric'
    };

    var permissionsSort = {
    id: 'permissionsCount',
    title:  'Permissions',
    sortType: 'numeric'
    };

    $scope.sortConfig = {
      fields: [
        nameSort,
        usersSort,
        permissionsSort
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

    //Get the roles data
    $scope.rolesLoaded = false;
    var roles = $resource('/roles/all');
    roles.get(function(data) {
      $scope.allRoles = data.data;
      $scope.allRoles.forEach(function(role){
        role.usersInfo = {
          name: "Users",
          count: role.usersCount,
          iconClass: "fa fa-user"
        };
        role.permissionsInfo = {
          name: "Permissions",
          count: role.permissionsCount,
          iconClass: "fa fa-user"
        };
      });

      $scope.roles = listUtils.applyFilters($scope.allRoles, $scope.toolbarConfig.filterConfig);
      $scope.rolesLoaded = true;
    },
    function() {
      // Log an error
      $scope.rolesLoaded = true;
    });
  }
]);
