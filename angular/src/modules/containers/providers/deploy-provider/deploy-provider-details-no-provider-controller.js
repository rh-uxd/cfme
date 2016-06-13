angular.module('miq.containers.providersModule').controller('containers.deployProviderDetailsNoProviderController',
  ['$rootScope', '$scope', '$document', '$modal',
  function($rootScope, $scope, $document, $modal) {
    'use strict';

    var modalInstance;

    $scope.updateNodeSettings();

    $scope.addVM = function () {
      var modalInstance = $modal.open({
        animation: true,
        backdrop: 'static',
        templateUrl: 'modules/containers/providers/deploy-provider/add-host-dialog.html',
        controller: 'containers.addHostDialogController',
        size: 'md'
      });

      modalInstance.rendered.then(function () {
        $document[0].getElementById('add-private-name').focus();
      });

      modalInstance.result.then(function () {
      }, function (newHost) {
        $scope.nodeData.allNodes.push(newHost);
        $scope.updateNodeSettings();
        $scope.nodeData.userDefinedVMs = $scope.nodeData.allNodes;
      }, function (reason) {
      });
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
