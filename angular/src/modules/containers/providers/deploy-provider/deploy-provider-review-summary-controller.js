angular.module('miq.containers.providersModule').controller('containers.deployProviderReviewSummaryController',
  ['$rootScope', '$scope', '$timeout',
  function($rootScope, $scope, $timeout) {
    'use strict';

    var firstShow = true;
    $scope.onShow = function () {
      if (firstShow) {
        firstShow = false;
      }
      $scope.pageShown = true;
      $timeout(function() {
        $scope.pageShown = false;  // done so the next time the page is shown it updates
      });
    };
  }
]);
