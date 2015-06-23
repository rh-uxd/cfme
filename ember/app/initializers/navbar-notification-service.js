export function initialize(container, application) {
  application.inject('route', 'navbarNotificationService', 'service:navbar-notification');
  application.inject('component', 'navbarNotificationService', 'service:navbar-notification');
}

export default {
  name: 'navbar-notification-service',
  initialize: initialize
};
