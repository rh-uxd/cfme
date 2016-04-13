angular.module('miq.containers.providersModule').controller('containers.deployProviderMasterNodesController',
  ['$rootScope', '$scope', '$timeout', '$document',
  function($rootScope, $scope, $timeout, $document) {
    'use strict';

    $scope.deploymentDetailsMasterNodesComplete = false;
    $scope.reviewTemplate = "/modules/containers/providers/deploy-provider/deploy-provider-master-nodes-review.html";

    $scope.onShow = function () {
      if ($scope.data.provisionOn == 'noProvider') {
        $timeout(function() {
          var queryResult = $document[0].getElementById('deploy-key');
          queryResult.focus();
        }, 200);
      }
    };

    $scope.validateNodeCounts = function () {
      $scope.mastersCount = $scope.data.masters ? $scope.data.masters.length : 0;
      $scope.nodesCount = $scope.data.nodes ? $scope.data.nodes.length : 0;
      $scope.infraNodesCount = $scope.data.infraNodes ? $scope.data.infraNodes.length : 0;

      var mastersValid = $scope.mastersCount === 1 || $scope.mastersCount === 3 || $scope.mastersCount === 5;
      $scope.mastersWarning = mastersValid ? '' : "The number of Masters must be 1, 3, or 5";

      var nodesValid = $scope.nodesCount >= 1;
      $scope.nodesWarning = nodesValid ? '' : "You must select at least one Node";

      return (mastersValid && nodesValid);
    };

    $scope.setMasterNodesComplete = function(value) {
      $scope.deploymentDetailsMasterNodesComplete = value;
    }
  }
]);
