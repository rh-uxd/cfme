angular.module('cfme.containers.podsModule').controller('containers.podsController', ['$rootScope', '$scope', '$resource', '$location', 'ChartsDataMixin', 'pfViewUtils',
  function($rootScope, $scope, $resource, $location, chartsDataMixin, pfViewUtils) {
    'use strict';

    // stash a ref to the controller object, and the various parent objects
    var vm = this;

    vm.listId = 'containersPodsList';
    var handleClick = function(item) {
      $location.path('/containers/pods/' + item.name);
    };

    var viewSelected = function(view) {
      $rootScope.podsViewType = view
    };

    vm.viewsConfig = {
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

    vm.applyFilters = function (pods) {
      if (vm.toolbarConfig.filterConfig.appliedFilters && vm.toolbarConfig.filterConfig.appliedFilters.length > 0) {
        vm.pods = [];
        vm.allPods.forEach(function (pod) {
         if (matchesFilters(pod, vm.toolbarConfig.filterConfig.appliedFilters)) {
           vm.pods.push(pod);
         }
        });
      } else {
        vm.pods = pods;
      }
      vm.toolbarConfig.filterConfig.resultsCount = vm.pods.length;
    };

    var filterChange = function (filters) {
      $rootScope.podsViewFilters = filters;
      vm.applyFilters(vm.allPods);
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
      if (vm.sortConfig.currentField.id === 'name') {
        compValue = item1.name.localeCompare(item2.name);
      } else if (vm.sortConfig.currentField.id === 'uptime') {
        compValue = item1.uptime.localeCompare(item2.uptime);
      } else if (vm.sortConfig.currentField.id === 'containers') {
        compValue = item1.containersCount - item2.containersCount;
      } else if (vm.sortConfig.currentField.id === 'cpuUsage') {
        compValue = item1.milliCoresUsed - item2.milliCoresUsed;
      } else if (vm.sortConfig.currentField.id === 'cpuUsage') {
        compValue = item1.memoryUsed - item2.memoryUsed;
      }

      if (!vm.sortConfig.isAscending) {
        compValue = compValue * -1;
      }

      return compValue;
    };

    var sortChange = function (sortId, isAscending) {
      if (vm.pods && vm.pods.length > 0) {
        vm.pods.sort(compareFn);
      }
    };

    vm.sortConfig = {
      fields: [
        {
          id: 'name',
          title:  'Name',
          sortType: 'alpha'
        },
        {
          id: 'uptime',
          title:  'Up Time',
          sortType: 'numeric'
        },
        {
          id: 'containers',
          title:  'Containers Count',
          sortType: 'numeric'
        },
        {
          id: 'cpuUsage',
          title:  'CPU Usage',
          sortType: 'numeric'
        },
        {
          id: 'memoryUsage',
          title:  'Memory Usage',
          sortType: 'numeric'
        }
      ],
      onSortChange: sortChange,
    };

    vm.toolbarConfig = {
//      viewsConfig: vm.viewsConfig,
      filterConfig: filterConfig,
      sortConfig: vm.sortConfig
    };

    if (!$rootScope.podsViewType) {
      $rootScope.podsViewType = vm.viewsConfig.views[0].id;
    }
    vm.viewsConfig.currentView = $rootScope.podsViewType;

    if ($rootScope.podsViewFilters) {
      vm.toolbarConfig.filterConfig.appliedFilters = $rootScope.podsViewFilters;
    }

    vm.listConfig = {
      selectItems: false,
      multiSelect: false,
      selectionMatchProp: 'name',
      selectedItems: [],
      checkDisabled: false,
      onClick: handleClick
    };

    //Get the pods data
    vm.podsLoaded = false;
    var pods = $resource('/containers/pods/all');
    pods.get(function(data) {
      vm.allPods = data.data;
      vm.applyFilters(vm.allPods);
      vm.podsLoaded = true
    });
  }
]);
