angular.module('miq.containers.providersModule').controller('containers.deployProviderController',
  ['$rootScope', '$scope', '$timeout',
  function($rootScope, $scope, $timeout) {
    'use strict';

    $scope.data = {};
    $scope.deployComplete = false;
    $scope.deployInProgress = false;
    var initializeDeploymentWizard = function () {
      $scope.data = {
        providerName: '',
        providerType: 'atomic',
        provisionOn: 'existingVms',
        masterCount: 0,
        nodeCount: 0,
        infraNodeCount: 0,
        cdnConfigType: 'satellite'
      };

      $scope.deploymentDetailsGeneralComplete = false;
      $scope.deployComplete = false;
      $scope.deployInProgress = false;
      $scope.nextButtonTitle = "Next >";
    };

    var startDeploy = function () {
      $scope.deployInProgress = true;
      $timeout(function () {
        $scope.deployInProgress = false;
        $scope.deployComplete = true;
        $scope.nextButtonTitle = "Close";

      }, 5000);

    };

    $scope.nextCallback = function(step) {
      if (step.stepTitle == 'Review') {
        if ($scope.deployComplete) {
          return true;
        } else if (!$scope.deployInProgress) {
          startDeploy();
        }
        return false;
      } else {
        return true;
      }
    };
    $scope.backCallback = function(step) {
      return true;
    };

    $scope.$on("wizard:stepChanged", function(e, parameters) {
      if (parameters.step.stepId == 'review') {
        $scope.nextButtonTitle = "Deploy";
      } else {
        $scope.nextButtonTitle = "Next >";
      }
    });


    $scope.showDeploymentWizard = false;
    var showListener =  function() {
      if (!$scope.showDeploymentWizard) {
        initializeDeploymentWizard();
        $scope.showDeploymentWizard = true;
      }
    };
    $rootScope.$on('deployProvider.show', showListener);

    $scope.cancelDeploymentWizard = function () {
      if (!$scope.deployInProgress) {
        $scope.showDeploymentWizard = false;
      }
    };

    $scope.$on('$destroy', showListener);


    $scope.cancelWizard = function () {
      $scope.showDeploymentWizard = false;
      return true;
    };

    $scope.finishedWizard = function () {
      $rootScope.$emit('deployProvider.finished');
      $scope.showDeploymentWizard = false;
      return true;
    };
  }
]);
