angular.module('miq.appModule').directive('miqNotificationList', function () {
  'use strict';

  return {
    restrict: 'A',
    templateUrl: 'modules/app/directives/notifications/notification-list.html',
    controller: function ($scope, $rootScope) {
      $scope.notifications = $rootScope.notifications;
    }
  };
});
