angular.module('miq.containers.providersModule').controller('containers.addHostDialogController',
  ['$rootScope', '$scope',
  function($rootScope, $scope) {
    'use strict';

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

    $scope.cancelAddDialog = function () {
      $scope.$close();
    };

    $scope.saveAddDialog = function () {
      if ($scope.newHost.vmName && $scope.newHost.vmName.length > 0) {
        $scope.$dismiss($scope.newHost);
      }
    };

    var userUpdatedPublicName = false;
    $scope.newVmSelectAll = function () {
      $scope.newHost.master = true;
      $scope.newHost.node = true;
      $scope.newHost.storage = true;
      $scope.newHost.loadBalancer = true;
      $scope.newHost.dns = true;
      $scope.newHost.etcd = true;
      $scope.newHost.infrastructure = true;
    };

    $scope.updateNewVMName = function () {
      if (!userUpdatedPublicName) {
        $scope.newHost.publicName = $scope.newHost.vmName;
      }
    };

    $scope.updateNewVMPublicName = function () {
      if ($scope.newHost.publicName != $scope.newHost.vmName) {
        userUpdatedPublicName = true;
      } else {
        userUpdatedPublicName = false;
      }
    };
  }
]);
