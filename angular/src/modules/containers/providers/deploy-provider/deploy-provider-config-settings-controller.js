angular.module('miq.containers.providersModule').controller('containers.deployProviderConfigSettingsController',
  ['$rootScope', '$scope', '$timeout', '$document',
  function($rootScope, $scope, $timeout, $document) {
    'use strict';

    var firstShow = true;
    $scope.onShow = function () {
      if (firstShow) {
        $scope.data.storageType = 'nfs';
        $scope.data.nfsStorageUsername = '';
        $scope.data.nfsStoragePassword = '';
        $scope.data.nfsStorageUrl = '';
        firstShow = false;
      }
      $scope.validateForm();

      $timeout(function() {
        var queryResult = $document[0].getElementById('rhn-user-name');
        queryResult.focus();
      }, 200);
    };

    var validString = function(value) {
      return angular.isDefined(value) && value.length > 0;
    };

    $scope.validateForm = function() {
      $scope.configStorageComplete =
        $scope.data.storageType !== 'nfs' ||
        (validString($scope.data.nfsStorageUsername) &&
         validString($scope.data.nfsStoragePassword) &&
         validString($scope.data.nfsStorageUrl));
    };
  }
]);
