angular.module('miq.appModule').service( 'miq.notificationService', ['Notifications', '$timeout',
  function (Notifications, $timeout) {
    var $this = this;

    this.notificationDrawerHidden = true;

    this.toggleNotficationDrawerHidden = function () {
      this.notificationDrawerHidden = !this.notificationDrawerHidden
    };

    var notificationHeadingMap = {
      'system': 'System Notification',
      'user': 'User Notification',
      'other': 'Other Notification',
      'custom': 'Custom Notification',
      'more': 'More Notification'
    };

    var currentTime = (new Date()).getTime();

    this.notificationGroups = [
      {
        notificationType: 'system',
        heading: "System Notifications",
        unreadCount: 5,
        notifications: [
          {
            unread: true,
            message: "A New Event! Huzzah! Bold",
            status: 'info',
            timeStamp: currentTime - (1 * 60 * 60 * 1000)
          },
          {
            unread: true,
            message: "Another Event Notification",
            status: 'success',
            timeStamp: currentTime - (2 * 60 * 60 * 1000)
          },
          {
            unread: true,
            message: "Another Event Notification",
            status: 'warning',
            timeStamp: currentTime - (10 * 60 * 60 * 1000)
          },
          {
            unread: true,
            message: "Another Event Notification",
            status: 'error',
            timeStamp: currentTime - (12 * 60 * 60 * 1000)
          },
          {
            unread: true,
            message: "A New Event! Huzzah! Bold",
            status: 'info',
            timeStamp: currentTime - (1 * 60 * 60 * 1000)
          },
          {
            unread: false,
            message: "Another Event Notification",
            status: 'error',
            timeStamp: currentTime - (2 * 60 * 60 * 1000)
          },
          {
            unread: false,
            message: "Another Event Notification",
            status: 'success',
            timeStamp: currentTime - (10 * 60 * 60 * 1000)
          },
          {
            unread: false,
            message: "Another Event Notification",
            status: 'warning',
            timeStamp: currentTime - (12 * 60 * 60 * 1000)
          },
          {
            unread: false,
            message: "Another Event Notification",
            status: 'info',
            timeStamp: currentTime - (240 * 60 * 60 * 1000)
          }
        ]
      },
      {
        notificationType: 'user',
        heading: "User Notifications",
        unreadCount: 3,
        notifications: [
          {
            unread: true,
            message: "A New Event! Huzzah! Bold",
            status: 'info',
            timeStamp: currentTime - (1 * 60 * 60 * 1000)
          },
          {
            unread: true,
            message: "Another Event Notification",
            status: 'error',
            timeStamp: currentTime - (2 * 60 * 60 * 1000)
          },
          {
            unread: true,
            message: "Another Event Notification",
            status: 'warning',
            timeStamp: currentTime - (10 * 60 * 60 * 1000)
          },
          {
            unread: false,
            message: "Another Event Notification",
            status: 'success',
            timeStamp: currentTime - (12 * 60 * 60 * 1000)
          },
          {
            unread: false,
            message: "Another Event Notification",
            status: 'warning',
            timeStamp: currentTime - (240 * 60 * 60 * 1000)
          }
        ]
      },
      {
        notificationType: 'other',
        heading: "Other Notifications",
        unreadCount: 3,
        notifications: [
          {
            unread: true,
            message: "A New Event! Huzzah! Bold",
            status: 'success',
            timeStamp: currentTime - (1 * 60 * 60 * 1000)
          },
          {
            unread: true,
            message: "Another Event Notification",
            status: 'warning',
            timeStamp: currentTime - (2 * 60 * 60 * 1000)
          },
          {
            unread: true,
            message: "Another Event Notification",
            status: 'info',
            timeStamp: currentTime - (10 * 60 * 60 * 1000)
          },
          {
            unread: false,
            message: "Another Event Notification",
            status: 'success',
            timeStamp: currentTime - (12 * 60 * 60 * 1000)
          },
          {
            unread: false,
            message: "Another Event Notification",
            status: 'error',
            timeStamp: currentTime - (240 * 60 * 60 * 1000)
          }
        ]
      },
      {
        notificationType: 'custom',
        heading: "Custom Notifications",
        unreadCount: 3,
        notifications: [
          {
            unread: true,
            message: "A New Event! Huzzah! Bold",
            status: 'warning',
            timeStamp: currentTime - (1 * 60 * 60 * 1000)
          },
          {
            unread: true,
            message: "Another Event Notification",
            status: 'success',
            timeStamp: currentTime - (2 * 60 * 60 * 1000)
          },
          {
            unread: true,
            message: "Another Event Notification",
            status: 'success',
            timeStamp: currentTime - (10 * 60 * 60 * 1000)
          },
          {
            unread: false,
            message: "Another Event Notification",
            status: 'error',
            timeStamp: currentTime - (12 * 60 * 60 * 1000)
          },
          {
            unread: false,
            message: "Another Event Notification",
            status: 'info',
            timeStamp: currentTime - (240 * 60 * 60 * 1000)
          }
        ]
      },
      {
        notificationType: 'more',
        heading: "More Notifications",
        unreadCount: 3,
        notifications: [
          {
            unread: true,
            message: "A New Event! Huzzah! Bold",
            status: 'error',
            timeStamp: currentTime - (1 * 60 * 60 * 1000)
          },
          {
            unread: true,
            message: "Another Event Notification",
            status: 'error',
            timeStamp: currentTime - (2 * 60 * 60 * 1000)
          },
          {
            unread: true,
            message: "Another Event Notification",
            status: 'warning',
            timeStamp: currentTime - (10 * 60 * 60 * 1000)
          },
          {
            unread: false,
            message: "Another Event Notification",
            status: 'warning',
            timeStamp: currentTime - (12 * 60 * 60 * 1000)
          },
          {
            unread: false,
            message: "Another Event Notification",
            status: 'error',
            timeStamp: currentTime - (240 * 60 * 60 * 1000)
          }
        ]
      }
    ];

    var updateUnreadCount = function (group) {
      if (group) {
        group.unreadCount = group.notifications.filter(function (notification) {
          return notification.unread;
        }).length;
      }
    };

    this.addNotification = function (notificationType, message, status) {
      var newNotification = {
        unread: true,
        message: message,
        status: status,
        timeStamp: (new Date()).getTime()
      };

      var group = this.notificationGroups.find(function (notificationGroup) {
        return notificationGroup.notificationType == notificationType;
      });

      if (group) {
        if (group.notifications) {
          group.notifications.splice(0, 0, newNotification);
        } else {
          group.notifications = [newNotification];
        }
        updateUnreadCount(group);
      }

      if (notificationType == 'system') {}
      Notifications.message(status, notificationHeadingMap[notificationType], message, false);
    };

    this.markNotificationRead = function (notification, group) {
      if (notification) {
        notification.unread = false;
      }
      if (group) {
        updateUnreadCount(group);
      } else {
        this.notificationGroups.forEach(function (group) {
          updateUnreadCount(group);
        });
      }
    };

    this.markNotificationUnread = function (notification, group) {
      if (notification) {
        notification.unread = true;
      }
      if (group) {
        updateUnreadCount(group);
      } else {
        this.notificationGroups.forEach(function (group) {
          updateUnreadCount(group);
        });
      }
    };

    this.markAllNotificationsRead = function (group) {
      if (group) {
        group.notifications.forEach(function (notification) {
          notification.unread = false;
        });
        group.unreadCount = 0;
      }
    };

    this.markAllNotificationsUnread = function (group) {
      if (group) {
        group.notifications.forEach(function (notification) {
          notification.unread = true;
        });
        group.unreadCount = group.notifications.length();
      }
    };

    this.addNotification('user', 'Login Successful', 'success');
    $timeout(function() {
      $this.addNotification('system', 'Error occurred while trying to contact server for user preferences', 'error');
    }, 5000);
  }
]);
