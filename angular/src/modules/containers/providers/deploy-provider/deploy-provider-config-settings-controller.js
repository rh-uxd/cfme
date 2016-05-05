angular.module('miq.containers.providersModule').controller('containers.deployProviderConfigSettingsController',
  ['$rootScope', '$scope', '$timeout', '$document',
  function($rootScope, $scope, $timeout, $document) {
    'use strict';

    $scope.reviewTemplate = "/modules/containers/providers/deploy-provider/deploy-provider-config-settings-review.html";
    var firstShow = true;
    $scope.onShow = function () {
      if (firstShow) {
        $scope.data.configureIntegratedNFS = false;
        $scope.data.configureRouter = false;
        $scope.data.configureRegistry = false;
        $scope.data.configureMetrics = false;
        $scope.data.registryServer = '';
        $scope.data.registryPath = '';
        $scope.data.metricsServer = '';
        $scope.data.metricsPath = '';
        firstShow = false;
      }
      $scope.validateForm();

      $timeout(function() {
        var queryResult = $document[0].getElementById('rhn-user-name');
        queryResult.focus();
      }, 200);

      //$timeout(function() {
      //  if ($scope.data.configureRegistry) {
      //    var queryResult = $document[0].getElementById('registry-server');
      //    queryResult.focus();
      //  }
      //}, 200);

    //  $timeout(function() {
    //    if ($scope.data.configureRegistry) {
    //      var queryResult = $document[0].getElementById('metrics-server');
    //      queryResult.focus();
    //    }
    //  }, 200);
    };

    var validString = function(value) {
      return angular.isDefined(value) && value.length > 0;
    };

    $scope.validateForm = function() {
      var configStorageComplete =
        $scope.data.storageType !== 'nfs' ||
        (validString($scope.data.nfsStorageUsername) &&
         validString($scope.data.nfsStoragePassword) &&
         validString($scope.data.nfsStorageUrl));

      var configRegistryComplete =
        !$scope.data.configureRegistry ||
        (validString($scope.data.registryServer) &&
        validString($scope.data.registryPath));

      var configMetricsComplete =
        !$scope.data.configureMetrics ||
        (validString($scope.data.metricsServer) &&
        validString($scope.data.metricsPath));

      $scope.configSettingsComplete = configStorageComplete && configRegistryComplete && configMetricsComplete;
    };
  }
]);
