import Ember from 'ember';

export default Ember.Component.extend({

  providerType: null,

  isOpenShift: (function () {
    return this.get('providerType') === 'openshift';
  }).property('providerType'),

  isKubernetes: (function () {
    return this.get('providerType') === 'kubernetes';
  }).property('providerType')
});