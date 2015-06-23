import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('index', {path: '/'});
  this.route('containers', {path: '/containers'}, function() {
    this.route('providers', {path: '/providers', queryParams: ['provider_type']});
    this.route('projects', {path: '/projects'});
  });
});

export default Router;
