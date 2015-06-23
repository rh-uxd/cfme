define('dashboard/components/object-status-chart', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    typeIconClass: '',
    objectCount: 0,
    objectType: '',
    linkRoute: null,

    hasRoute: (function () {
      var linkRoute = this.get('linkRoute');
      return linkRoute !== null;
    }).property('linkRoute'),

    isSVG: (function () {
      return this.get('typeIconClass').indexOf('.svg') !== -1;
    }).property('typeIconClass'),

    objectId: 1
  });

});