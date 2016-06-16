angular.module('miq.userAdminModule').controller('userAdmin.usersController',
  ['$rootScope', '$scope', '$resource', '$location', 'ChartsDataMixin', 'ListUtils', 'ColumnsConfig',
  function($rootScope, $scope, $resource, $location, chartsDataMixin, listUtils, columnsConfig) {
    'use strict';

    $scope.listId = 'usersList';

    var nameColumn = {
      columnType: 'label',
      field: 'username',
      width: columnsConfig.nameColumnWidth
    };

    var nameEmailColumn = {
      columnType: 'labelValues',
      fields: [
        {
          label: 'Name',
          value: 'name'
        },
        {
          label: 'Email',
          value: 'email'
        }

      ],
      titleWidth: 65,
      width: 230
    };
    var roleColumn = {
      columnType: 'labelValues',
      fields: [
        {
          label: 'Role',
          value: 'role'
        },
      ],
      width: columnsConfig.nameColumnWidth
    };

    var groupsInfoColumn = {
      columnType: 'objectCount',
      infoField: 'groupsInfo',
      width: columnsConfig.nameColumnWidth
    };

    $scope.columns = [
      nameColumn,
      nameEmailColumn,
      roleColumn,
      groupsInfoColumn
    ];

    var matchesFilter = function (item, filter) {
      var match = true;

      if (filter.id === 'name') {
        match = item.name.match(filter.value) !== null;
      }
      else if (filter.id === 'username') {
        match = item.username.match(filter.value) !== null;
      }
      else if (filter.id === 'role') {
        match = item.role.match(filter.value) !== null;
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
      $rootScope.usersViewFilters = filters;
      $scope.users = applyFilters($scope.allUsers, $scope.toolbarConfig.filterConfig);
    };

    var filterConfig = {
      fields: [
        {
          id: 'username',
          title: 'Username',
          placeholder: 'Filter by Username',
          filterType: 'text'
        },
        listUtils.nameFilter,
        {
          id: 'username',
          title: 'Username',
          placeholder: 'Filter by Username',
          filterType: 'text'
        },
        {
          id: 'role',
          title: 'Role',
          placeholder: 'Filter by Role',
          filterType: 'text'
        }
      ],
      resultsCount: 0,
      appliedFilters: [],
      onFilterChange: filterChange
    };

    var sortChange = function (sortId, isAscending) {
      listUtils.sortList($scope.users, sortId, $scope.sortConfig.isAscending);
    };

    var nameSort = {
      id: 'name',
      title:  'Name',
      sortType: 'alpha'
    };

    var usernameSort = {
      id: 'username',
      title:  'Username',
      sortType: 'alpha'
    };

    var roleSort = {
      id: 'role',
      title:  'Role',
      sortType: 'alpha'
    };

    $scope.sortConfig = {
      fields: [
        nameSort,
        usernameSort,
        roleSort
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

    //Get the users data
    $scope.usersLoaded = false;
    var users = $resource('/users/all');
    users.get(function(data) {
      $scope.allUsers = data.data;
      $scope.allUsers.forEach(function(user){
        user.groupsInfo = {
          name: "Groups",
          count: user.groupsCount,
          iconClass: "fa fa-users"
        };
      });

      $scope.users = listUtils.applyFilters($scope.allUsers, $scope.toolbarConfig.filterConfig);

      $scope.usersLoaded = true;
    },
    function() {
      // Log an error
      $scope.usersLoaded = true;
    });
  }
]);
