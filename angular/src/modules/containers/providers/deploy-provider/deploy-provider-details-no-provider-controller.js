angular.module('miq.containers.providersModule').controller('containers.deployProviderDetailsNoProviderController',
  ['$rootScope', '$scope', '$timeout', '$document',
  function($rootScope, $scope, $timeout, $document) {
    'use strict';

    $scope.showAddDialog = false;
    $scope.newItem = {};
    $scope.data.deploymentKey = '';
    $scope.data.deploymentUsername ='';

    var validString = function(value) {
      return angular.isDefined(value) && value.length > 0;
    };

    $scope.validateForm = function() {
      $scope.setMasterNodesComplete(validString($scope.data.deploymentKey) &&
        validString($scope.data.deploymentKey) &&
        validString($scope.data.deploymentUsername) &&
        $scope.validateNodeCounts());
    };

    $scope.clearDeploymentKey = function() {
      $scope.data.deploymentKey = '';
      $scope.validateForm();
    };

    var onKeyFileChosen = function(e) {
      var reader = new FileReader();
      reader.onload = function() {
        $scope.data.deploymentKey = reader.result;
        $scope.$apply();
      };
      reader.readAsText(e.target.files[0]);
    };

    $scope.browseKeyFile = function() {
      var uploadfile = $document[0].getElementById('browse-key-input');
      uploadfile.onchange = onKeyFileChosen;
      uploadfile.click();
    };

    $scope.allNodes = [];

    var compareFn = function (item1, item2) {
      var compValue = 0;
      if ($scope.sortConfig.currentField.id === 'name') {
        compValue = item1.vmName.localeCompare(item2.vmName);
      } else {
        if ($scope.sortConfig.currentField.id === 'role') {
          if (item1.master != item2.master) {
            if (item1.master) {
              compValue = -1;
            } else {
              compValue = 1;
            }
          }
          else if (item1.node != item2.node) {
            if (item1.node) {
              compValue = -1;
            } else {
              compValue = 1;
            }
          }
          else if (item1.storage != item2.storage) {
            if (item1.storage) {
              compValue = -1;
            } else {
              compValue = 1;
            }
          }
          else if (item1.loadBalancer != item2.loadBalancer) {
            if (item1.loadBalancer) {
              compValue = -1;
            } else {
              compValue = 1;
            }
          }
          else if (item1.dns != item2.dns) {
            if (item1.dns) {
              compValue = -1;
            } else {
              compValue = 1;
            }
          }
          else if (item1.etcd != item2.etcd) {
            if (item1.etcd) {
              compValue = -1;
            } else {
              compValue = 1;
            }
          }
          else if (item1.loadBalancer != item2.loadBalancer) {
            if (item1.loadBalancer) {
              compValue = -1;
            } else {
              compValue = 1;
            }
          }
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

    var sortChange = function (sortId, isAscending) {
      $scope.allNodes.sort(compareFn);
    };

    $scope.sortConfig = {
      fields: [
        {
          id: 'name',
          title: 'Name',
          sortType: 'alpha'
        },
        {
          id: 'role',
          title: 'Role',
          sortType: 'alpha'
        }
      ],
      onSortChange: sortChange
    };
    $scope.sortConfig.currentField = $scope.sortConfig.fields[1];

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

      var selectedCount = $scope.allNodes.filter(function(node) {
        return node.selected;
      }).length;
      $scope.allNodesSelected = (selectedCount > 0) && (selectedCount === $scope.allNodes.length);

      sortChange();
      $scope.validateForm();
    };

    $scope.cancelAddDialog = function () {
      $scope.showAddDialog = false;
    };

    $scope.saveAddDialog = function () {
      if ($scope.newHost.vmName && $scope.newHost.vmName.length > 0) {
        $scope.allNodes.push($scope.newHost);
        $scope.showAddDialog = false;
        updateNodeSettings();
      }
    };

    $scope.addVM = function () {
      $scope.newHost = {
        vmName: "",
        publicName: "",
        master: false,
        node: false,
        storage: false,
        loadBalancer: false,
        dns: false,
        etcd: false,
        infrastructure: false
      };
      $scope.showAddDialog = true;
      $timeout(function() {
        $document[0].getElementById('add-private-name').focus();
      }, 200);
    };

    var removeItems = function () {
      $scope.allNodes = $scope.allNodes.filter(function(item) {
        return !item.selected;
      });
      updateNodeSettings();
    };

    var removeRoles = function () {
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

    $scope.actionsConfig = {
      actionsInclude: true,
      moreActions: [
        {
          name: 'Remove Roles',
          actionFn: removeRoles
        },
        {
          name: 'Remove VM(s)',
          title: 'Clear the selected items.',
          actionFn: removeItems
        }
      ]
    };

    $scope.toolbarConfig = {
      sortConfig: $scope.sortConfig,
      actionsConfig: $scope.actionsConfig
    };


    var updateSetNodeTypeButtons = function () {
      var selectedCount = $scope.allNodes.filter(function(node) {
        return node.selected;
      }).length;
      $scope.disableMasterNodeActions = selectedCount === 0;
      $scope.actionsConfig.moreActions[0].isDisabled = $scope.disableMasterNodeActions;
      $scope.actionsConfig.moreActions[1].isDisabled = $scope.disableMasterNodeActions;
    };

    $scope.allNodesSelected = false;
    $scope.toggleAllNodesSelected = function() {
      $scope.allNodesSelected = !$scope.allNodesSelected;
      $scope.allNodes.forEach(function (item, index) {
        item.selected = $scope.allNodesSelected;
      });
      updateSetNodeTypeButtons();
    };

    $scope.toggleNodeSelected = function(node) {
      node.selected = !node.selected;
      var found = $scope.allNodes.find(function(node) {
        return !node.selected;
      });
      $scope.allNodesSelected = $scope.allNodes.length > 0 && (found === undefined);
      updateSetNodeTypeButtons();
    };
    updateSetNodeTypeButtons();

    updateNodeSettings();
  }
]);
