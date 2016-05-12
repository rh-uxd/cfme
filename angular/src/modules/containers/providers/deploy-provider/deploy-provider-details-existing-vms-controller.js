angular.module('miq.containers.providersModule').controller('containers.deployProviderDetailsExistingVMsController',
  ['$rootScope', '$scope', '$resource',
  function($rootScope, $scope, $resource) {
    'use strict';

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

    var compareFn = function (item1, item2) {
      var compValue = 0;
      if ($scope.sortConfig.currentField.id === 'name') {
        compValue = item1.vmName.localeCompare(item2.vmName);
      } else {
        if ($scope.sortConfig.currentField.id === 'state') {
          compValue = item1.state.localeCompare(item2.state);
        } else if ($scope.sortConfig.currentField.id === 'cpus') {
          compValue = item1.cpus - item2.cpus;
        } else if ($scope.sortConfig.currentField.id === 'memory') {
          compValue = item1.memory - item2.memory;
        } else if ($scope.sortConfig.currentField.id === 'diskSize') {
          compValue = item1.diskSize - item2.diskSize;
        }
        if (compValue === 0) {
          compValue = item1.vmName.localeCompare(item2.vmName);
        }
      }

      if (!$scope.sortConfig.isAscending) {
        compValue = compValue * -1;
      }

      return compValue;
    };

    var sortChange = function () {
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
    $scope.sortConfig.currentField = $scope.sortConfig.fields[1];

    var updateSetNodeTypeButtons = function () {
      var selectedCount = $scope.filteredNodes.filter(function(node) {
        return node.selected;
      }).length;
      $scope.disableMasterNodeActions = selectedCount === 0;

      $scope.allNodesSelected = (selectedCount > 0) && (selectedCount === $scope.filteredNodes.length);
    };

    var updateNodeSettings = function () {
      $scope.data.masters = $scope.allNodes.filter(function(node) {
        return node.master === true;
      });
      $scope.data.nodes = $scope.allNodes.filter(function(node) {
        return node.node === true;
      });
      $scope.data.storageNodes = $scope.allNodes.filter(function(node) {
        return node.storage === true;
      });
      $scope.data.loadBalancerNodes = $scope.allNodes.filter(function(node) {
        return node.loadBalancer === true;
      });
      $scope.data.dnsNodes = $scope.allNodes.filter(function(node) {
        return node.dns === true;
      });
      $scope.data.etcdNodes = $scope.allNodes.filter(function(node) {
        return node.etcd === true;
      });
      $scope.data.infrastructureNodes = $scope.allNodes.filter(function(node) {
        return node.infrastructure === true;
      });

      $scope.setMasterNodesComplete($scope.validateNodeCounts());
      $scope.allNodes.forEach(function (item) {
        item.selected = false;
      });

      applyFilters();
      sortChange();
      updateSetNodeTypeButtons();
    };

    $scope.removeRoles = function () {
      $scope.allNodes.forEach(function(node) {
        if (node.selected) {
          node.master = false;
          node.node = false;
          node.storage = false;
          node.loadBalancer = false;
          node.dns = false;
          node.etcd = false;
          node.infrastructure = false;
        }
      });
      updateNodeSettings();
    };

    $scope.actionsConfig = {
      actionsInclude: true
    };

    $scope.toolbarConfig = {
      filterConfig: $scope.filterConfig,
      sortConfig: $scope.sortConfig,
      actionsConfig: $scope.actionsConfig
    };

    $scope.editRolesStatus = {
      open: false
    };

    $scope.onToolbarMenuShow = function() {
      var selectedNodes =  $scope.allNodes.filter(function(node) {
        return node.selected === true;
      });

      var allMasters = selectedNodes.filter(function(node) {
        return node.master === true;
      }).length === selectedNodes.length;
      var allNodes = selectedNodes.filter(function(node) {
          return node.node === true;
        }).length === selectedNodes.length;
      var allStorage = selectedNodes.filter(function(node) {
          return node.storage === true;
        }).length === selectedNodes.length;
      var allLoadBalancers = selectedNodes.filter(function(node) {
          return node.loadBalancer === true;
        }).length === selectedNodes.length;
      var allDNS = selectedNodes.filter(function(node) {
          return node.dns === true;
        }).length === selectedNodes.length;
      var allEtcd = selectedNodes.filter(function(node) {
          return node.etcd === true;
        }).length === selectedNodes.length;
      var allInfrastructure = selectedNodes.filter(function(node) {
          return node.infrastructure === true;
        }).length === selectedNodes.length;

      $scope.toolbarMenu = {
        master: allMasters,
        node: allNodes,
        storage: allStorage,
        loadBalancer: allLoadBalancers,
        dns: allDNS,
        etcd: allEtcd,
        infrastructure: allInfrastructure
      };
    };

    $scope.updateSelectedRoles = function() {
      var selectedNodes =  $scope.allNodes.filter(function(node) {
        return node.selected === true;
      });

      selectedNodes.forEach(function(item) {
        item.master = $scope.toolbarMenu.master;
        item.node = $scope.toolbarMenu.node;
        item.storage = $scope.toolbarMenu.storage;
        item.loadBalancer = $scope.toolbarMenu.loadBalancer;
        item.dns = $scope.toolbarMenu.dns;
        item.etcd = $scope.toolbarMenu.etcd;
        item.infrastructure = $scope.toolbarMenu.infrastructure;
      });
      updateNodeSettings();
      $scope.editRolesStatus.open = false;
    };

    $scope.addMaster = function(item) {
      item.master = true;
      updateNodeSettings();
    };

    $scope.addNode = function(item) {
      item.node = true;
      updateNodeSettings();
    };

    $scope.addStorage = function(item) {
      item.storage = true;
      updateNodeSettings();
    };

    $scope.addLoadBalancer = function(item) {
      item.loadBalancer = true;
      updateNodeSettings();
    };

    $scope.addDns = function(item) {
      item.dns = true;
      updateNodeSettings();
    };

    $scope.addEtcd = function(item) {
      item.etcd = true;
      updateNodeSettings();
    };

    $scope.addInfrastructure = function(item) {
      item.infrastructure = true;
      updateNodeSettings();
    };

    $scope.removeMaster = function(item) {
      item.master = false;
      updateNodeSettings();
    };

    $scope.removeNode = function(item) {
      item.node = false;
      updateNodeSettings();
    };

    $scope.removeStorage = function(item) {
      item.storage = false;
      updateNodeSettings();
    };

    $scope.removeLoadBalancer = function(item) {
      item.loadBalancer = false;
      updateNodeSettings();
    };

    $scope.removeDns = function(item) {
      item.dns = false;
      updateNodeSettings();
    };

    $scope.removeEtcd = function(item) {
      item.etcd = false;
      updateNodeSettings();
    };

    $scope.removeInfrastructure = function(item) {
      item.infrastructure = false;
      updateNodeSettings();
    };

    var providers = $resource('/containers/providers/nodes');
    providers.get(function (data) {
      $scope.allNodes = data.data;
      applyFilters($scope.filterConfig.appliedFilters);
      updateSetNodeTypeButtons();
    });

    $scope.allNodesSelected = false;
    $scope.toggleAllNodesSelected = function() {
      $scope.allNodesSelected = !$scope.allNodesSelected;
      $scope.filteredNodes.forEach(function (item, index) {
        item.selected = $scope.allNodesSelected;
      });
      updateSetNodeTypeButtons();
    };

    $scope.updateAllNodesSelected = function() {
      var found = $scope.filteredNodes.find(function(node) {
        return !node.selected;
      });
      $scope.allNodesSelected = (found === undefined);
    };

    $scope.toggleNodeSelected = function(node) {
      node.selected = !node.selected;
      $scope.updateAllNodesSelected ();
      updateSetNodeTypeButtons();
    };

    updateNodeSettings();
  }
]);
