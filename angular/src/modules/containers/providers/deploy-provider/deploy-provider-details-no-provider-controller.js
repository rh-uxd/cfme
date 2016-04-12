angular.module('miq.containers.providersModule').controller('containers.deployProviderDetailsNoProviderController',
  ['$rootScope', '$scope', '$resource',
  function($rootScope, $scope) {
    'use strict';

    $scope.showAddDialog = false;
    $scope.newItem = {};

    $scope.onShow = function () {
      console.log("On Show");
      $timeout(function() {
        console.log("Timeout");
        console.log($scope.data.provisionOn);
        if ($scope.data.provisionOn == 'noProvider') {
          console.log("Focusing...");
          var queryResult = $document[0].getElementById('deploy-key');
          console.dir(queryResult);
          queryResult.focus();
        }
      }, 200);
    };

    var validString = function(value) {
      return angular.isDefined(value) && value.length > 0;
    };

    $scope.validateForm = function() {
      $scope.setMasterNodesComplete(validString($scope.data.deploymentKey) &&
        validString($scope.data.deploymentUsername) &&
        validString($scope.data.deploymentKey) &&
        $scope.validateNodeCounts());
    };

    $scope.allNodes = [];
    var stateVals = {
      'Unset': 1,
      'Master': 2,
      'Node': 3
    };

    var compareFn = function (item1, item2) {
      var compValue = 0;
      if ($scope.sortConfig.currentField.id === 'name') {
        compValue = item1.vmName.localeCompare(item2.vmName);
      } else if ($scope.sortConfig.currentField.id === 'state') {
        compValue = item1.state.localeCompare(item2.state);
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
          id: 'state',
          title: 'State',
          sortType: 'alpha'
        },
        {
          id: 'name',
          title: 'VM Name',
          sortType: 'alpha'
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
        return node.state === 'InfraNode';
      });

      $scope.mastersCount = $scope.data.masters ? $scope.data.masters.length : 0;
      $scope.nodesCount = $scope.data.nodes ? $scope.data.nodes.length : 0;
      $scope.infraNodesCount = $scope.data.infraNodes ? $scope.data.infraNodes.length : 0;

      var mastersValid = $scope.mastersCount === 1 || $scope.mastersCount === 3 || $scope.mastersCount === 5;
      $scope.mastersWarning = mastersValid ? '' : "Masters can be set to 1, 3, or 5";

      var nodesValid = $scope.nodesCount >= 1;
      $scope.nodesWarning = nodesValid ? '' : "You must select at least one Node";

      sortChange();
      $scope.validateForm();
    };

    $scope.cancelAddDialog = function () {
      $scope.showAddDialog = false;
    };

    $scope.saveAddDialog = function () {
      if ($scope.newItem.vmName && $scope.newItem.vmName.length > 0) {
        $scope.allNodes.push($scope.newItem);
        $scope.showAddDialog = false;
        updateNodeSettings();
      }
    };
    $scope.updaterName = function() {
      console.log($scope.newItem.name);
    };

    var addMaster = function () {
      $scope.addDialogTitle = "Add Master";
      $scope.addDialogText = "Please enter the Host Name or IP Address for the new Master";
      $scope.newItem = {
        vmName: "",
        state:  "Master"
      };
      $scope.showAddDialog = true;
    };

    var addNode = function () {
      $scope.addDialogTitle = "Add Node";
      $scope.addDialogText = "Please enter the Host Name or IP Address for the new Node";
      $scope.newItem = {
        vmName: "",
        state:  "Node"
      };
      $scope.showAddDialog = true;
    };

    var addInfraNode = function () {
      $scope.addDialogTitle = "Add Infra Node";
      $scope.addDialogText = "Please enter the Host Name or IP Address for the new Infra Node";
      $scope.newItem = {
        vmName: "",
        state:  "InfraNode"
      };
      $scope.showAddDialog = true;
      updateNodeSettings();
    };

    var removeItems = function () {
      $scope.allNodes = $scope.allNodes.filter(function(item) {
        return !item.selected;
      });
      updateNodeSettings();
    };

    $scope.actionsConfig = {
      primaryActions: [
        {
          name: 'Add Master',
          actionFn: addMaster
        },
        {
          name: 'Add Node',
          actionFn: addNode
        }
      ],
      moreActions: [
        {
          name: 'Add Infra Node',
          actionFn: addInfraNode
        },
        {
          name: 'Remove',
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
      $scope.actionsConfig.moreActions[1].isDisabled = selectedCount === 0;
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
      $scope.allNodesSelected = (found === undefined);
      updateSetNodeTypeButtons();
    };
    updateSetNodeTypeButtons();

    updateNodeSettings();
  }
]);
