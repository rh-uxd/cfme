angular.module('miq.containers.providersModule').controller('containers.deployProviderMasterNodesController',
  ['$rootScope', '$scope', '$resource',
  function($rootScope, $scope, $resource) {
    'use strict';


    $scope.updateMasterCount = function (value) {
      if ($scope.data.masterCount + value >= 0) {
        $scope.data.masterCount += value;
      }
    };
    $scope.updateNodesCount = function (value) {
      if ($scope.data.nodeCount + value >= 0) {
        $scope.data.nodeCount += value;
      }
    };

    $scope.allNodes = [];
    $scope.filteredNodes = [];

    var matchesFilter = function (item, filter) {
      var match = true;

      if (filter.id === 'name') {
        match = item.name.match(filter.value) !== null;
      } else if (filter.id === 'state') {
        match = item.state === filter.value;
      }
      return match;
    };

    var matchesFilters = function (item) {
      var matches = true;

      $scope.filterConfig.appliedFilters.forEach(function (filter) {
        if (!matchesFilter(item, filter)) {
          matches = false;
          return false;
        }
      });
      return matches;
    };

    var applyFilters = function () {
      if ($scope.filterConfig.appliedFilters && $scope.filterConfig.appliedFilters.length > 0) {
        $scope.filteredNodes = $scope.allNodes.filter(matchesFilters);
      } else {
        $scope.filteredNodes = $scope.allNodes;
      }
      $scope.filterConfig.resultsCount = $scope.filteredNodes.length;
    };

    var filterChange = function (filters) {
      applyFilters(filters);
      $scope.toolbarConfig.filterConfig.resultsCount = $scope.filteredNodes.length;
    };

    $scope.filterConfig = {
      fields: [
        {
          id: 'name',
          title: 'Name',
          placeholder: 'Filter by Name...',
          filterType: 'text'
        },
        {
          id: 'state',
          title: 'State',
          placeholder: 'Filter by State...',
          filterType: 'select',
          filterValues: ['Unset', 'Master', 'Node']
        }
      ],
      resultsCount: $scope.filteredNodes.length,
      appliedFilters: [],
      onFilterChange: filterChange
    };

    var stateVals = {
      'Unset': 1,
      'Master': 2,
      'Node': 3
    };

    var compareFn = function (item1, item2) {
      var compValue = 0;
      if ($scope.sortConfig.currentField.id === 'name') {
        compValue = item1.providerName.localeCompare(item2.providerName);
      } else if ($scope.sortConfig.currentField.id === 'state') {
        compValue = stateVals[item1.state] - stateVals[item2.state];
      } else if ($scope.sortConfig.currentField.id === 'cpus') {
        compValue = item1.cpus - item2.cpus;
      } else if ($scope.sortConfig.currentField.id === 'memory') {
        compValue = item1.memory - item2.memory;
      } else if ($scope.sortConfig.currentField.id === 'diskSize') {
        compValue = item1.diskSize - item2.diskSize;
      }

      if (!$scope.sortConfig.isAscending) {
        compValue = compValue * -1;
      }

      return compValue;
    };

    var sortChange = function (sortId, isAscending) {
      $scope.filteredNodes.sort(compareFn);
    };

    $scope.sortConfig = {
      fields: [
        {
          id: 'name',
          title: 'Name',
          sortType: 'alpha'
        },
        {
          id: 'state',
          title: 'State',
          sortType: 'alpha'
        },
        {
          id: 'cpus',
          title: '# CPUS',
          sortType: 'numeric'
        },
        {
          id: 'memory',
          title: 'Memory',
          sortType: 'numeric'
        },
        {
          id: 'diskSize',
          title: 'Disk Size',
          sortType: 'numeric'
        }
      ],
      onSortChange: sortChange
    };

    var updateNodeSettings = function () {
      $scope.data.masters = $scope.allNodes.filter(function(node) {
        return node.state === 'Master';
      });
      $scope.data.nodes = $scope.allNodes.filter(function(node) {
        return node.state === 'Node';
      });
      $scope.data.infraNodes = $scope.allNodes.filter(function(node) {
        return node.state === 'Infra Node';
      });

      $scope.mastersCount = $scope.data.masters ? $scope.data.masters.length : 0;
      $scope.nodesCount = $scope.data.nodes ? $scope.data.nodes.length : 0;
      $scope.infraNodesCount = $scope.data.infraNodes ? $scope.data.infraNodes.length : 0;

      var mastersValid = $scope.mastersCount === 1 || $scope.mastersCount === 3 || $scope.mastersCount === 5;
      $scope.mastersWarning = mastersValid ? '' : "Masters can be set to 1, 3, or 5";

      var nodesValid = $scope.nodesCount >= 1;
      $scope.nodesWarning = nodesValid ? '' : "You must select at least one Node";

      $scope.masterNodesComplete = mastersValid && nodesValid;
      $scope.allNodes.forEach(function (item) {
        item.selected = false;
      });

      applyFilters();
    };

    var setMasters = function () {
      $scope.allNodes.forEach(function(node) {
        if (node.selected) {
          node.state = 'Master';
        }
      });
      updateNodeSettings();
    };

    var setNodes = function () {
      $scope.allNodes.forEach(function(node) {
        if (node.selected) {
          node.state = 'Node';
        }
      });
      updateNodeSettings();
    };

    var setInfraNodes = function () {
      $scope.allNodes.forEach(function(node) {
        if (node.selected) {
          node.state = 'Infra Node';
        }
      });
      updateNodeSettings();
    };

    var clearState = function () {
      $scope.allNodes.forEach(function(node) {
        if (node.selected) {
          node.state = 'Unset';
        }
      });
      updateNodeSettings();
    };

    $scope.actionsConfig = {
      primaryActions: [
        {
          name: 'Set Master',
          title: 'Set the selected items to be masters',
          actionFn: setMasters
        },
        {
          name: 'Set Node',
          title: 'Set the selected items to be nodes',
          actionFn: setNodes
        }
      ],
      moreActions: [
        {
          name: 'Set Infra Node',
          title: 'Set the selected items to be infra nodes',
          actionFn: setInfraNodes
        },
        {
          name: 'Clear State',
          title: 'Clear the state for the selected items.',
          actionFn: clearState
        }
      ]
    };

    $scope.toolbarConfig = {
      filterConfig: $scope.filterConfig,
      sortConfig: $scope.sortConfig,
      actionsConfig: $scope.actionsConfig
    };


    var providers = $resource('/containers/providers/nodes');
    providers.get(function (data) {
      $scope.allNodes = data.data;
      applyFilters($scope.filterConfig.appliedFilters);
    });

    var updateSetNodeTypeButtons = function () {
      var selectedCount = $scope.filteredNodes.filter(function(node) {
        return node.selected;
      }).length;
      $scope.actionsConfig.primaryActions[0].isDisabled = selectedCount === 0;
      $scope.actionsConfig.primaryActions[1].isDisabled = selectedCount === 0;
      $scope.actionsConfig.moreActions[0].isDisabled = selectedCount === 0;
      $scope.actionsConfig.moreActions[1].isDisabled = selectedCount === 0;
    };

    $scope.allNodesSelected = false;
    $scope.toggleAllNodesSelected = function() {
      $scope.allNodesSelected = !$scope.allNodesSelected;
      $scope.filteredNodes.forEach(function (item, index) {
        item.selected = $scope.allNodesSelected;
      });
      updateSetNodeTypeButtons();
    };

    $scope.toggleNodeSelected = function(node) {
      node.selected = !node.selected;
      var found = $scope.filteredNodes.find(function(node) {
        return !node.selected;
      });
      $scope.allNodesSelected = (found === undefined);
      updateSetNodeTypeButtons();
    };
    updateSetNodeTypeButtons();

    updateNodeSettings();
  }
]);
