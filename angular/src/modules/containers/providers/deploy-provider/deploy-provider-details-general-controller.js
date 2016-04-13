angular.module('miq.containers.providersModule').controller('containers.deployProviderDetailsGeneralController',
  ['$rootScope', '$scope', '$document', '$timeout',
  function($rootScope, $scope, $document, $timeout) {
    'use strict';

    $scope.reviewTemplate = "/modules/containers/providers/deploy-provider/deploy-provider-details-general-review.html";

    var firstShow = true;
    $scope.onShow = function () {
      if (firstShow) {
        $scope.existingProviders = [];

        $scope.data.providers.forEach(function(provider){
          $scope.existingProviders.push({
            id: provider.id,
            name: provider.name
          })
        });
        if (typeof $scope.existingProviders !== 'undefined' && $scope.existingProviders.length > 0) {
          $scope.data.existingProviderId = $scope.existingProviders[0].id;
        }

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
        $scope.data.newVmProviderId = $scope.newVmProviders[0].id;

        $scope.deploymentDetailsGeneralComplete = false;
        firstShow = false;

        $timeout(function() {
          var queryResult = $document[0].getElementById('new-provider-name');
          queryResult.focus();
        }, 200);
      }
    };
    $scope.updateProviderName = function() {
      $scope.deploymentDetailsGeneralComplete = angular.isDefined($scope.data.providerName) && $scope.data.providerName.length > 0;
    };
  }
]);
