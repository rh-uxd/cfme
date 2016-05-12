angular.module('miq.containers.providersModule').controller('containers.deployProviderMasterNodesController',
  ['$rootScope', '$scope', '$timeout', '$document',
  function($rootScope, $scope, $timeout, $document) {
    'use strict';

    $scope.deploymentDetailsMasterNodesComplete = false;
    $scope.reviewTemplate = "/modules/containers/providers/deploy-provider/deploy-provider-master-nodes-review.html";

    $scope.onShow = function () {
      $timeout(function() {
        var queryResult;
        if ($scope.data.provisionOn == 'noProvider') {
          queryResult = $document[0].getElementById('deploy-key');
        } else if ($scope.data.provisionOn == 'newVms') {
          queryResult = $document[0].getElementById('create-master-base-name');
        }
        if (queryResult) {
          queryResult.focus();
        }
      }, 200);
      $scope.validateNodeCounts();
    };

    $scope.masterCountValid = function(count) {
      var valid = count === 1 || count === 3 || count === 5;
      $scope.mastersWarning = valid ? '' : "The number of Masters must be 1, 3, or 5";
      return valid;
    };

    $scope.nodeCountValid = function(count) {
      var valid = count >= 1;
      $scope.nodesWarning = valid ? '' : "You must select at least one Node";
      return valid;
    };

    $scope.validateNodeCounts = function () {
      $scope.mastersCount = $scope.data.masters ? $scope.data.masters.length : 0;
      $scope.nodesCount = $scope.data.nodes ? $scope.data.nodes.length : 0;
      $scope.storageCount = $scope.data.storageNodes ? $scope.data.storageNodes.length : 0;
      $scope.loadBalancerCount = $scope.data.loadBalancerNodes ? $scope.data.loadBalancerNodes.length : 0;
      $scope.dnsCount = $scope.data.dnsNodes ? $scope.data.dnsNodes.length : 0;
      $scope.etcdCount = $scope.data.etcdNodes ? $scope.data.etcdNodes.length : 0;
      $scope.infrastructureCount = $scope.data.infrastructureNodes ? $scope.data.infrastructureNodes.length : 0;

      var mastersValid = $scope.masterCountValid($scope.mastersCount);
      var nodesValid = $scope.nodeCountValid($scope.nodesCount);
      return mastersValid && nodesValid;
    };

    $scope.setMasterNodesComplete = function(value) {
      $scope.deploymentDetailsMasterNodesComplete = value;
    }
  }
]);
