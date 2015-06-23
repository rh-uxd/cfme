define('dashboard/components/provider-type-tile', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({

    providerType: null,

    isOpenShift: (function () {
      return this.get('providerType') === 'openshift';
    }).property('providerType'),

    isKubernetes: (function () {
      return this.get('providerType') === 'kubernetes';
    }).property('providerType')
  });

});