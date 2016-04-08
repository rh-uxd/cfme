angular.module('miq.containers.providersModule').controller('containers.deployProviderCDNChannelController',
  ['$rootScope', '$scope', '$timeout', '$document',
  function($rootScope, $scope, $timeout, $document) {
    'use strict';

    var firstShow = true;
    $scope.onCdnShow = function () {
      if (firstShow) {
        $scope.data.rhnUsername = '';
        $scope.data.rhnPassword = '';
        $scope.data.rhnSKU = '';
        $scope.data.specifySatelliteUrl = false;
        $scope.data.rhnSatelliteUrl = '';
        firstShow = false;
        $scope.deploymentDetailsCDNComplete = false;
      }
      $timeout(function() {
        var queryResult = $document[0].getElementById('rhn-user-name');
        queryResult.focus();
      }, 200);
    };

    var validString = function(value) {
      return angular.isDefined(value) && value.length > 0;
    };

    $scope.validateForm = function() {
      $scope.deploymentDetailsCDNComplete = validString($scope.data.rhnUsername) &&
        validString($scope.data.rhnPassword) &&
        validString($scope.data.rhnSKU) &&
        (!$scope.data.specifySatelliteUrl || validString($scope.data.rhnSatelliteUrl));
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
        compValue = item1.providerName.localeCompare(item2.providerName);
      } else if ($scope.sortConfig.currentField.id === 'state') {
        compValue = stateVals[item1.state] - stateVals[item2.state];
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
          title: 'VM Name',
          sortType: 'alpha'
        },
        {
          id: 'state',
          title: 'State',
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
        return node.state === 'Infra Node';
      });

      $scope.mastersCount = $scope.data.masters ? $scope.data.masters.length : 0;
      $scope.nodesCount = $scope.data.nodes ? $scope.data.nodes.length : 0;
      $scope.infraNodesCount = $scope.data.infraNodes ? $scope.data.infraNodes.length : 0;

      var mastersValid = $scope.mastersCount === 1 || $scope.mastersCount === 3 || $scope.mastersCount === 5;
      $scope.mastersWarning = mastersValid ? '' : "Masters can be set to 1, 3, or 5";

      var nodesValid = $scope.nodesCount >= 1;
      $scope.nodesWarning = nodesValid ? '' : "You must select at least one Node";

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
      $scope.addDialogTitle = "Add Master";
      $scope.addDialogText = "Please enter the Host Name or IP Address for the new Node";
      $scope.newItem = {
        vmName: "",
        state:  "Node"
      };
      $scope.showAddDialog = true;
    };

    var addInfraNode = function () {
      $scope.addDialogTitle = "Add Master";
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
        },
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
      $scope.actionsConfig.primaryActions[3].isDisabled = selectedCount === 0;
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
