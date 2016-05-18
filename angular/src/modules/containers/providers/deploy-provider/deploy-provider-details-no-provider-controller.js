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
      $scope.updateNodeSettings();
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

    $scope.cancelAddDialog = function () {
      $scope.showAddDialog = false;
    };

    $scope.saveAddDialog = function () {
      if ($scope.newHost.vmName && $scope.newHost.vmName.length > 0) {
        $scope.nodeData.allNodes.push($scope.newHost);
        $scope.showAddDialog = false;
        $scope.updateNodeSettings();
        $scope.nodeData.userDefinedVMs = $scope.nodeData.allNodes;
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
      $scope.nodeData.allNodes = $scope.nodeData.allNodes.filter(function(item) {
        return !item.selected;
      });
      $scope.nodeData.userDefinedVMs = $scope.nodeData.allNodes;
      $scope.updateNodeSettings();
    };

    var actionsConfig = {
      actionsInclude: true,
      moreActions: [
        {
          name: 'Remove Roles',
          actionFn: $scope.removeRoles
        },
        {
          name: 'Remove VM(s)',
          title: 'Clear the selected items.',
          actionFn: removeItems
        }
      ]
    };

    var sortChange = function () {
      $scope.sortConfig.currentField = sortConfig.currentField;
      $scope.sortConfig.isAscending = sortConfig.isAscending;
      $scope.sortChange();
    };


    var sortConfig = {
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
    sortConfig.currentField = sortConfig.fields[1];

    $scope.toolbarConfig = {
      sortConfig: sortConfig,
      actionsConfig: actionsConfig
    };
  }
]);
