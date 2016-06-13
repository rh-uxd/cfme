angular.module( 'miq.appModule' ).directive('miqToastNotification', ['miq.notificationService',
  function (notificationService) {
    'use strict';

    return {
      scope: {
        'notification': '=',
        'notificationIndex': '='
      },
      restrict: 'A',
      templateUrl: 'modules/app/directives/notifications/toast-notification.html',
      controller: function($scope) {
        $scope.notificationType = $scope.notification.status;
        if ($scope.notificationType == 'error') {
          $scope.notificationType = 'danger';
        } else if ($scope.notificationType == 'ok') {
          $scope.notificationType = 'success';
        }

        $scope.handleEnter = function () {
          notificationService.setViewingToastNotification($scope.notification, true);
        };

        $scope.handleLeave = function () {
          notificationService.setViewingToastNotification($scope.notification, false);
        };

        $scope.handleDismiss = function () {
          notificationService.dismissToastNotification($scope.notification, false);
        };
      }
    };
  }
]);
