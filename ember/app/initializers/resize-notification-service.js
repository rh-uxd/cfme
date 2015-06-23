export function initialize(container, application) {
  application.inject('route', 'resizeNotificationService', 'service:resize-notification');
  application.inject('component', 'resizeNotificationService', 'service:resize-notification');
}

export default {
  name: 'resize-notification-service',
  initialize: initialize
};
