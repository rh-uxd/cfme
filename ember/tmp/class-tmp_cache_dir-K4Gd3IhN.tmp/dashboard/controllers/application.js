define('dashboard/controllers/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    appName: 'Dashboard'
  });

});