define('dashboard/initializers/navbar-notification-service', ['exports'], function (exports) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    application.inject('route', 'navbarNotificationService', 'service:navbar-notification');
    application.inject('component', 'navbarNotificationService', 'service:navbar-notification');
  }

  exports['default'] = {
    name: 'navbar-notification-service',
    initialize: initialize
  };

});