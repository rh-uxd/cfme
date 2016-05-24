angular.module('miq.containers.providersModule').controller('containers.deployProviderReviewSummaryController',
  ['$rootScope', '$scope', '$timeout', '$document',
  function($rootScope, $scope, $timeout, $document) {
    'use strict';

    var firstShow = true;
    $scope.data.editedInventoryText = '';
    $scope.navTooltip = "";

    $scope.onShow = function () {
      if (firstShow) {
        firstShow = false;
        $scope.data.inventoryText = "";
      }
      $scope.pageShown = true;
      $timeout(function() {
        $scope.pageShown = false;  // done so the next time the page is shown it updates
      });

      // Simulate retrieving inventory text
      $scope.showWaitDialog = true;
      $timeout(function() {
        $scope.data.inventoryText = "Text of the Inventory goes here";
        $scope.data.editedInventoryText = $scope.data.inventoryText;
        //$scope.onInventoryTextChange();
        $scope.showWaitDialog = false;
      }, 2000);
    };

    $scope.showAdvancedSettings = false;

    $scope.toggleAdvancedSettings = function () {
      $scope.showAdvancedSettings = !$scope.showAdvancedSettings;
    };

    //$scope.onInventoryTextChange = function () {
    //  $scope.inventoryChanged = $scope.data.editedInventoryText != $scope.data.inventoryText;
    //  $scope.okToNavAway = !$scope.inventoryChanged;
    //
    //  if ($scope.inventoryChanged) {
    //    $scope.navTooltip = "Save or cancel inventory changes before leaving this step"
    //  } else {
    //    $scope.navTooltip = "";
    //  }
    //};
    //
    //$scope.cancelInventoryChanges = function() {
    //  $scope.data.editedInventoryText = $scope.data.inventoryText;
    //  $scope.onInventoryTextChange();
    //}
    //
    //$scope.saveInventoryChanges = function() {
    //  $scope.data.inventoryText = $scope.data.editedInventoryText;
    //  $scope.onInventoryTextChange();
    //}
  }
]);
