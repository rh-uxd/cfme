define('dashboard/initializers/resize-notification-service', ['exports'], function (exports) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    application.inject('route', 'resizeNotificationService', 'service:resize-notification');
    application.inject('component', 'resizeNotificationService', 'service:resize-notification');
  }

  exports['default'] = {
    name: 'resize-notification-service',
    initialize: initialize
  };

});