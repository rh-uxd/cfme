import Ember from 'ember';

export default Ember.Component.extend({

  errorStatusIconClass: 'pficon-error-circle-o',
  okStatusIconClass: 'pficon-ok',

  aggregateTypeIconClass: '',
  aggregateType: '',
  aggregateCount: 0,
  errorCount: 0,

  allGood: (function () {
    return this.get('errorCount') === 0;
  }).property('errorCount')
});