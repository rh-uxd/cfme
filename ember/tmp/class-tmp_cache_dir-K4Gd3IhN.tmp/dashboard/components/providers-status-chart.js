define('dashboard/components/providers-status-chart', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({

    openShiftCount: 0,
    kubernetesCount: 0,

    numProviders: (function () {
      return this.get('openShiftCount') + this.get('kubernetesCount');
    }).property('openShiftCount', 'kubernetesCount'),

    openshiftTooltip: (function () {
      var count = this.get('openShiftCount');
      if (count === 1) {
        return '1 OpenShift Provider';
      } else {
        return count + 'OpenShift Providers';
      }
    }).property('openShiftCount'),

    kubernetesTooltip: (function () {
      var count = this.get('kubernetesCount');
      if (count === 1) {
        return '1 Kubernetes Provider';
      } else {
        return count + 'Kubernetes Providers';
      }
    }).property('kubernetesCount')
  });

});