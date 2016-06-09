angular.module( 'miq.appModule' ).directive('miqToastNotification', function () {
  'use strict';

  return {
    scope: {
      'notificationType': '=',
      'notificationMessage': '=',
      'notificationHeader': '=',
      'notificationPersistent': '=',
      'notificationIndex': '='
    },
    restrict: 'A',
    templateUrl: 'modules/app/directives/notifications/toast-notification.html',
    controller: function($scope) {
      if ($scope.notificationType == 'error') {
        $scope.notificationType = 'danger';
      }
      if ($scope.notificationType == 'ok') {
        $scope.notificationType = 'success';
      }
    }
  };
});
