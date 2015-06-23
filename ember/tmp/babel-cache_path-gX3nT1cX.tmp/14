import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['id'],
  id: 1,

  getTypeIcon: function getTypeIcon(providerType) {
    if (providerType === 'openshift') {
      return 'pficon-openshift';
    }
    if (providerType === 'kubernetes') {
      return 'pficon-kubernetes';
    }
    return null;
  },

  crumbs: (function () {
    return [{
      isActive: true,
      route: 'index',
      title: 'Projects'
    }, {
      isActive: false,
      title: this.get('model').name,
      suffix: this.get('model').provider.name,
      suffixIconClass: this.getTypeIcon(this.get('model').provider.providerType)
    }];
  }).property('model', 'model.name', 'model.provider.name', 'model.provider.providerType'),

  nodeHeatMapUsageLegendLabels: (function () {
    return ['< 70%', '70-80%', '80-90%', '> 90%'];
  }).property(),
  nodeHeatMapNetworkLegendLabels: (function () {
    return ['Very High', 'High', 'Low', 'Very Low'];
  }).property()
});