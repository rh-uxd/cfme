angular.module('miq.appModule').service( 'miq.notificationService', ['Notifications', '$timeout',
  function (Notifications, $timeout) {
    var $this = this;

    this.notificationDrawerHidden = true;
    this.toastDelay = 8000;

    this.toggleNotficationDrawerHidden = function () {
      this.notificationDrawerHidden = !this.notificationDrawerHidden
      if (!this.notificationDrawerHidden) {
        var found = false;
        this.notificationGroups.forEach(function(group) {
          if (!found && group.unreadCount > 0) {
            group.open = true;
            found = true;
          } else {
            group.open = false;
          }
        })
      }
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
        notificationType: 'task',
        heading: "Tasks",
        unreadCount: 0,
        notifications: [
          {
            unread: false,
            message: 'Deployment "OSE Deploy" was canceled',
            status: 'warning',
            startTime: currentTime - (22 * 60 * 60 * 1000),
            endTime: currentTime - (24 * 60 * 60 * 1000),
            timeStamp: currentTime - (24 * 60 * 60 * 1000)
          }
        ]
      },
      {
        notificationType: 'event',
        heading: "Events",
        unreadCount: 0,
        notifications: [
          {
            unread: false,
            message: '2 Servers with RHEL 7.2 were retired',
            status: 'info',
            timeStamp: currentTime - (1 * 60 * 60 * 1000)
          },
          {
            unread: false,
            message: 'Request denied for provisioning a server',
            status: 'error',
            timeStamp: currentTime - (2 * 60 * 60 * 1000)
          },
          {
            unread: false,
            message: '2 Servers with RHEL 7.2 were edited',
            status: 'info',
            timeStamp: currentTime - (10 * 60 * 60 * 1000)
          },
          {
            unread: false,
            message: 'Request create for provisioning a server',
            status: 'info',
            timeStamp: currentTime - (12 * 60 * 60 * 1000)
          },
          {
            unread: false,
            message: '2 Servers with RHEL 7.2 will retire in 10 days',
            status: 'warning',
            timeStamp: currentTime - ((24 * 10 + 1) * 60 * 60 * 1000)
          },
          {
            unread: false,
            message: '2 Servers with RHEL 7.2 were scheduled to be retired in 14 days',
            status: 'info',
            timeStamp: currentTime - ((24 * 14 + 1) * 60 * 60 * 1000)
          },
          {
            unread: false,
            message: 'Request to provision a server succeeded',
            status: 'success',
            timeStamp: currentTime - ((24 * 16 - 5) * 60 * 60 * 1000)
          }
        ]
      }
    ];

    this.toastNotifications = [];

    this.removeToast = function (notification) {
      var index = $this.toastNotifications.indexOf(notification);
      if (index > -1) {
        $this.toastNotifications.splice(index, 1);
      }
    };

    this.showToast = function (notification) {
      notification.show = true;
      this.toastNotifications.push(notification);

      if (notification.status != 'danger' && notification.status != 'error') {
        $timeout(function () {
          notification.show = false;
          if (!notification.viewing) {
            $this.removeToast(notification);
          }
        }, this.toastDelay);
      }
    };

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
        header: notificationHeadingMap[notificationType],
        message: message,
        status: status,
        persistent: true,
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

      this.showToast(newNotification);
    };

    this.setViewingToastNotification = function (notification, viewing) {
      notification.viewing = viewing;
      if (!viewing && !notification.show) {
        this.removeToast(notification);
      }
    };

    this.dismissToastNotification = function (notification) {
      notification.show = false;
      this.removeToast(notification);
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

    this.clearNotifcation = function (notification, group) {
      if (!group) {
        group = this.notificationGroups.find(function (nextGroup) {
          return nextGroup.notifications.find(function (nextNotification) {
            return nextNotification == notificationHeadingMap;
          })
        });
      }

      if (group) {
        var index = group.notifications.indexOf(notification);
        if (index > -1) {
          group.notifications.splice(index, 1);
          updateUnreadCount(group);
        }
      }
    };

    this.clearAllNotifications = function (group) {
      if (group) {
        group.notifications = [];
        updateUnreadCount(group);
      };
    }
  }
]);
