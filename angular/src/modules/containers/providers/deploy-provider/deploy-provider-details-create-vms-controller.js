angular.module('miq.containers.providersModule').controller('containers.deployProviderDetailsCreateVMsController',
  ['$rootScope', '$scope', '$timeout', '$document',
  function($rootScope, $scope, $timeout, $document) {
    'use strict';

    $scope.reviewTemplate = "/modules/containers/providers/deploy-provider/deploy-provider-master-nodes-review-create-vms.html";
    var firstShow = true;

    $scope.onShow = function () {
      if (firstShow) {
        firstShow = false;

        $scope.data.createMastersCount = 1;
        $scope.data.createNodesCount = 1;

        $scope.data.masterCreationTemplateId = $scope.data.nodeCreationTemplates[0].id;
        $scope.data.nodeCreationTemplateId = $scope.data.nodeCreationTemplates[0].id;
        $scope.data.createNodesLikeMasters = true;
      }

      $timeout(function() {
        var queryResult = $document[0].getElementById('create-master-base-name');
        if (queryResult) {
          queryResult.focus();
        }
      }, 200);

      $scope.validateForm();
    };

    $scope.updateNewVMs = function () {
      var i;

      $scope.nodeData.newVMs = [];
      for (i = 0; i < $scope.data.createMastersCount; i++) {
        $scope.nodeData.newVMs.push(
          {
            vmName: $scope.data.createMasterBaseName + (i + 1),
            publicName: "",
            master: true,
            node: false,
            storage: false,
            loadBalancer: false,
            dns: false,
            etcd: false,
            infrastructure: false,
            cpus: $scope.data.createMastersCpu,
            memory: $scope.data.createMastersMemory,
            diskSize: $scope.data.createMastersDisk
          }
        );
      }
      for (i = 0; i < $scope.data.createNodesCount; i++) {
        $scope.nodeData.newVMs.push(
          {
            vmName: $scope.data.createNodesBaseName + (i + 1),
            publicName: "",
            master: false,
            node: true,
            storage: false,
            loadBalancer: false,
            dns: false,
            etcd: false,
            infrastructure: false,
            cpus: $scope.data.createNodesLikeMasters ? $scope.data.createMastersCpu : $scope.data.createNodesCpu,
            memory: $scope.data.createNodesLikeMasters ? $scope.data.createMastersMemory : $scope.data.createNodesMemory,
            diskSize: $scope.data.createNodesLikeMasters ? $scope.data.createMastersDisk : $scope.data.createNodesDisk
          }
        );
      }
    };

    var validString = function(value) {
      return angular.isDefined(value) && value.length > 0;
    };

    $scope.masterCountValid = function(count) {
      return count === 1 || count === 3 || count === 5;
    };

    $scope.nodeCountValid = function(count) {
      return count >= 1;
    };

    $scope.validateForm = function() {
      var valid =  $scope.masterCountValid($scope.data.createMastersCount) && $scope.nodeCountValid($scope.data.createNodesCount);

      valid = valid &&
        validString($scope.data.createMasterBaseName) &&
        angular.isDefined($scope.data.createMastersMemory) &&
        angular.isDefined($scope.data.createMastersCpu) &&
        angular.isDefined($scope.data.createMastersDisk) &&
        validString($scope.data.createNodesBaseName);


      if (!$scope.data.createNodesLikeMasters) {
        valid = valid &&
          angular.isDefined($scope.data.createNodesMemory) &&
          angular.isDefined($scope.data.createNodesCpu) &&
          angular.isDefined($scope.data.createNodesDisk);
      }

      if (valid) {
        $scope.updateNewVMs ();
      }

      $scope.newVMsComplete = valid;
    };

    $scope.updateNodesLikeMaster = function() {
      if ($scope.data.createNodesLikeMasters) {
        $scope.data.nodeCreationTemplateId = $scope.data.masterCreationTemplateId;
        $scope.data.createNodesMemory = $scope.data.createMastersMemory;
        $scope.data.createNodesCpu = $scope.data.createMastersCpu;
        $scope.data.createNodesDisk = $scope.data.createMastersDisk;
      }
      $scope.validateForm();
    };

    $scope.applyMasterTemplate = function () {
      // TODO: Apply Template Settings to Masters

      $scope.validateForm ();
    };

    $scope.applyNodeTemplate = function () {
      // TODO: Apply Template Settings to Nodes

      $scope.validateForm ();
    };

    $scope.masterCountIncrement = function() {
      if ($scope.data.createMastersCount <= 3) {
        $scope.data.createMastersCount += 2;
      }
      $scope.validateForm ();
    };
    $scope.masterCountDecrement = function() {
      if ($scope.data.createMastersCount > 1) {
        $scope.data.createMastersCount -= 2;
      }
      $scope.validateForm ();
   };
    $scope.nodeCountIncrement = function() {
      $scope.data.createNodesCount += 1;
      $scope.validateForm ();
    };
    $scope.nodeCountDecrement = function() {
      if ($scope.data.createNodesCount > 1) {
        $scope.data.createNodesCount -= 1;
      }
      $scope.validateForm ();
    };
  }
]);
