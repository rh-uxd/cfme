'use strict';

angular.module('miq.appModule').controller( 'miq.notificationsController', ['$scope', '$rootScope', 'miq.notificationService',
  function( $scope, $rootScope, notificationService ) {
    $scope.drawerTitle = 'Notifications Drawer';
    $scope.clearAllTitle = 'Clear All';

    $scope.titleHtml = 'modules/app/controllers/drawer-title.html';
    $scope.headingHTML = 'modules/app/controllers/heading.html';
//    $scope.subHeadingHTML = 'modules/app/controllers/subheading.html';
    $scope.notificationHTML = 'modules/app/controllers/notification-body.html';
    $scope.notificationFooterHTML = 'modules/app/controllers/notification-footer.html';

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

    $scope.customScope = {
      drawerExpanded: false,
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
      markNotificationRead: function (notification, group) {
        notificationService.markNotificationRead(notification, group);
      },
      clearNotification: function (notification, group) {
        notificationService.clearNotifcation(notification, group);
      },
      clearAllNotifications: function (group) {
        notificationService.clearAllNotifications(group);
      },
      toggleExpandDrawer: function () {
        $scope.customScope.drawerExpanded = !$scope.customScope.drawerExpanded;

      }
    };
  }
]);
