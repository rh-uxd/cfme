'use strict';

angular.module('miq.appModule').controller( 'miq.navBarController', ['$scope', '$rootScope', 'miq.notificationService',
  function( $scope, $rootScope, notificationService ) {
    $scope.toggleNotificationDrawer = function () {
      notificationService.toggleNotficationDrawerHidden();
    };

    var findNewNotifications = function () {
      var notificationGroups = notificationService.notificationGroups;
      var found = false;
      notificationGroups.forEach(function (group) {
        if (group.unreadCount > 0) {
         found = true;
        }
      });
      return found;
    };

    $scope.newNotifications = findNewNotifications();

    $scope.$watch(function () {
      return notificationService.notificationGroups;
    },
    function() {
      $scope.newNotifications = findNewNotifications();
    }, true);
  }
]);
