angular.module('miq.containers.podsModule').controller('containers.podsController',
  ['$rootScope', '$scope', '$resource', '$location', 'ChartsDataMixin', 'ColumnsConfig', 'pfViewUtils',
  function($rootScope, $scope, $resource, $location, chartsDataMixin, columnsConfig, pfViewUtils) {
    'use strict';

    $scope.listId = 'containersPodsList';

    $scope.columns = [
      {
        columnType: 'label',
        field: 'name',
        width: columnsConfig.nameColumnWidth
      },
      {
        columnType: 'titleLabel',
        title: 'Uptime',
        field: 'uptime',
        width: columnsConfig.uptimeColumnWidth
      },
      {
        columnType: 'usage',
        usedLabel: 'CPU Used (mc)',
        totalLabel: 'Total (mc)',
        usedDataField: 'cpuUsageData',
        width: columnsConfig.cpuUsageColumnWidth,
        titleWidth: columnsConfig.cpuUsageTitleWidth
      },
      {
        columnType: 'usage',
        columnClass: 'memory-usage-column',
        usedLabel: 'Memory Used (MB)',
        totalLabel: 'Total (MB)',
        usedDataField: 'memoryUsageData',
        width: columnsConfig.memoryUsageColumnWidth,
        titleWidth: columnsConfig.memoryUsageTitleWidth
      },
      {
        columnType: 'objectCount',
        infoField: 'containersInfo',
        width: columnsConfig.containtersColumnWidth
      },
      {
        columnType: 'objectCount',
        infoField: 'imagesInfo',
        width: columnsConfig.imagesColumnWidth
      },
      {
        columnType: 'objectCount',
        infoField: 'servicesInfo',
        width: columnsConfig.servicesColumnWidth
      }
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

    var matchesFilter = function (pod, filter) {
      var match = true;

      if (filter.id === 'name') {
        match = pod.name.match(filter.value) !== null;
      }      return match;
    };

    var matchesFilters = function (pod, filters) {
      var matches = true;

      filters.forEach(function(filter) {
        if (!matchesFilter(pod, filter)) {
          matches = false;
          return false;
        }
      });
      return matches;
    };

    $scope.applyFilters = function (pods) {
      if ($scope.toolbarConfig.filterConfig.appliedFilters && $scope.toolbarConfig.filterConfig.appliedFilters.length > 0) {
        $scope.pods = [];
        $scope.allPods.forEach(function (pod) {
         if (matchesFilters(pod, $scope.toolbarConfig.filterConfig.appliedFilters)) {
           $scope.pods.push(pod);
         }
        });
      } else {
        $scope.pods = pods;
      }
      $scope.toolbarConfig.filterConfig.resultsCount = $scope.pods.length;
    };

    var filterChange = function (filters) {
      $rootScope.podsViewFilters = filters;
      $scope.applyFilters($scope.allPods);
    };

    var filterConfig = {
      fields: [
        {
          id: 'name',
          title:  'Name',
          placeholder: 'Filter by Name',
          filterType: 'text'
        }
      ],
      resultsCount: 0,
      appliedFilters: [],
      onFilterChange: filterChange
    };

    var compareFn = function(item1, item2) {
      var compValue = 0;
      if ($scope.sortConfig.currentField.id === 'name') {
        compValue = item1.name.localeCompare(item2.name);
      } else if ($scope.sortConfig.currentField.id === 'uptime') {
        compValue = item1.uptime.localeCompare(item2.uptime);
      } else if ($scope.sortConfig.currentField.id === 'containers') {
        compValue = item1.containersCount - item2.containersCount;
      } else if ($scope.sortConfig.currentField.id === 'cpuUsage') {
        compValue = item1.milliCoresUsed - item2.milliCoresUsed;
      } else if ($scope.sortConfig.currentField.id === 'cpuUsage') {
        compValue = item1.memoryUsed - item2.memoryUsed;
      }

      if (!$scope.sortConfig.isAscending) {
        compValue = compValue * -1;
      }

      return compValue;
    };

    var sortChange = function (sortId, isAscending) {
      if ($scope.pods && $scope.pods.length > 0) {
        $scope.pods.sort(compareFn);
      }
    };

    $scope.sortConfig = {
      fields: [
        {
          id: 'name',
          title:  'Name',
          sortType: 'alpha'
        },
        {
          id: 'uptime',
          title:  'Uptime',
          sortType: 'numeric'
        },
        {
          id: 'containers',
          title:  'Containers Count',
          sortType: 'numeric'
        },
        {
          id: 'cpuUsage',
          title:  'CPU Used',
          sortType: 'numeric'
        },
        {
          id: 'memoryUsage',
          title:  'Memory Used',
          sortType: 'numeric'
        }
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
      $scope.applyFilters($scope.allPods);
      $scope.podsLoaded = true
    });
  }
]);
