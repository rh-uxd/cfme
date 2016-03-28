angular.module('miq.containers.providersModule').controller('containers.deployProviderDetailsGeneralController',
  ['$rootScope', '$scope',
  function($rootScope, $scope) {
    'use strict';

    $scope.existingProviders = [
      {
        id: 1,
        name: 'Existing Provider 1'
      },
      {
        id: 2,
        name: 'Existing Provider 2'
      },
      {
        id: 3,
        name: 'Existing Provider 3'
      },
      {
        id: 4,
        name: 'Existing Provider 4'
      }
    ];
    $scope.data.existingProviderId = $scope.existingProviders[0].id;
    $scope.newVmProviders = [
      {
        id: 1,
        name: 'Existing Provider 1'
      },
      {
        id: 2,
        name: 'Existing Provider 2'
      },
      {
        id: 3,
        name: 'Existing Provider 3'
      },
      {
        id: 4,
        name: 'Existing Provider 4'
      }
    ];
    $scope.data.newVmProviderId = $scope.existingProviders[0].id;

    $scope.deploymentDetailsGeneralComplete = false;
    $scope.updateProviderName = function() {
      $scope.deploymentDetailsGeneralComplete = angular.isDefined($scope.data.providerName) && $scope.data.providerName.length > 0;
    };
  }
]);
