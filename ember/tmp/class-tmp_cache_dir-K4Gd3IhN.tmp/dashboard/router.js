define('dashboard/router', ['exports', 'ember', 'dashboard/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {
    this.route('index', { path: '/' });
    this.route('containers', { path: '/containers' }, function () {
      this.route('providers', { path: '/providers', queryParams: ['provider_type'] });
      this.route('projects', { path: '/projects' });
    });
  });

  exports['default'] = Router;

});