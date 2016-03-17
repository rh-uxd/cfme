angular.module('miq.containers.providersModule').controller('containers.deployProviderController',
  ['$rootScope', '$scope',
  function($rootScope, $scope) {
    'use strict';

    $scope.cancelWizard = function() {
      $rootScope.$emit('deployProvider.cancel');
    };

    $scope.finishedWizard = function() {
      $rootScope.$emit('deployProvider.finished');
    };
  }
]);
