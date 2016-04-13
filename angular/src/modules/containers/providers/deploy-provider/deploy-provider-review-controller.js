angular.module('miq.containers.providersModule').controller('containers.deployProviderReviewController',
  ['$rootScope', '$scope',
  function($rootScope, $scope) {
    'use strict';

    // Find the data!
    var next = $scope;
    while (angular.isUndefined($scope.data)) {
      next = next.$parent;
      if (angular.isUndefined(next)) {
        $scope.data = {};
      } else {
        $scope.data = next.wizardData;
      }
    }

    $scope.$watch('data.providerType', function(value) {
      console.log(value);
      if (value == 'openshiftOrigin') {
        $scope.providerType = "OpenShift Origin";
      } else if (value == 'openshiftEnterprise') {
        $scope.providerType = "OpenShift Enterprise";
      } else if (value == 'atomicPlatform') {
        $scope.providerType = "Atomic Platform";
      }
    });

    $scope.$watch('data.provisionOn', function(value) {
      if (value == 'existingVms') {
        $scope.providerDescription = 'Use existing VMs from an existing provider';
      }
      else if (value == 'newVms') {
        $scope.providerDescription = 'Create new VMs on provider';
      }
      else if (value == 'noProvider') {
        $scope.providerDescription = 'Specify a list of machines to deploy on (No existing provider';
      }
    });

    $scope.$watch('data.storageType', function(value) {
      if (value == 'nfs') {
        $scope.storageType = "NFS";
      }
      else if (value == 'gluster') {
        $scope.storageType = "Gluster";
      }
      else if (value == 'integratedNfs') {
        $scope.storageType = "Integrated NFS (POC's only)";
      }
      else if (value == 'none') {
        $scope.storageType = "None";
      }
    });
  }
]);
