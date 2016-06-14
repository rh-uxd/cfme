'use strict';

angular.module('miq.appModule').controller( 'miq.notificationsController', ['$scope', '$rootScope', 'miq.notificationService',
  function( $scope, $rootScope, notificationService ) {
    $scope.drawerTitle = 'Notifications Drawer';
    $scope.clearAllTitle = 'Clear All';

    $scope.headingHTML = 'modules/app/controllers/heading.html';
    $scope.subHeadingHTML = 'modules/app/controllers/subheading.html';
    $scope.notificationHTML = 'modules/app/controllers/notification-body.html';

    $scope.hideDrawer = true;
    $rootScope.$on('toggle-notification-drawer', function () {
      $scope.hideDrawer = !$scope.hideDrawer;
      console.log("Hide Drawer: " + $scope.hideDrawer);
    });

    $scope.groups = notificationService.notificationGroups;
    $scope.$watch(function () {
      return notificationService.notificationDrawerHidden;
    },
    function () {
      $scope.hideDrawer = notificationService.notificationDrawerHidden;
    });
    $scope.toastNotifications = notificationService.toastNotifications;

    $scope.clearAllCB = function (group) {
      notificationService.clearAllNotifications(group);
    };

    $scope.customScope = {
      getNotficationStatusIconClass: function (notification) {
        var retClass = '';
        if (notification && notification.status) {
          if (notification.status === 'info') {
            retClass = "pficon pficon-info";
          } else if (notification.status === 'error') {
            retClass = "pficon pficon-error-circle-o";
          } else if (notification.status === 'warning') {
            retClass = "pficon pficon-warning-triangle-o";
          } else if (notification.status === 'success') {
            retClass = "pficon pficon-ok";
          }
        }
        return retClass;
      },
      clearNotification: function (notification, group) {
        notificationService.clearNotifcation(notification, group);
      }
    };
  }
]);
