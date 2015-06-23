define('dashboard/controllers/containers/providers', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    queryParams: ['provider_type'],
    provider_type: null,
    crumbs: (function () {
      return [{
        isActive: true,
        route: 'index',
        title: 'Container Providers'
      }, {
        isActive: false,
        route: '',
        title: this.get('providerTitle')
      }];
    }).property('providerTitle'),

    providerTitle: (function () {
      if (this.get('isOpenShift')) {
        return 'OpenShift';
      } else {
        return 'Kubernetes';
      }
    }).property('isOpenShift'),

    isOpenShift: (function () {
      return this.get('provider_type') === 'openshift';
    }).property('provider_type'),

    isKubernetes: (function () {
      return this.get('provider_type') === 'kubernetes';
    }).property('provider_type'),

    projectId: (function () {
      if (this.get('isOpenShift')) {
        return 1;
      } else {
        return 2;
      }
    }).property('provider_type'),

    providerCount: (function () {
      return this.get('model').count;
    }).property('model.count'),

    nodeHeatMapUsageLegendLabels: (function () {
      return ['< 70%', '70-80%', '80-90%', '> 90%'];
    }).property(),
    nodeHeatMapNetworkLegendLabels: (function () {
      return ['Very High', 'High', 'Low', 'Very Low'];
    }).property()
  });

});