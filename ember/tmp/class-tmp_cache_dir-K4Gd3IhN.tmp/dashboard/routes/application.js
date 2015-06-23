define('dashboard/routes/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    setupController: function setupController(controller) {
      // `controller` is the instance of ApplicationController
      controller.set('title', 'Hello world, demo!');
    }

  });

});