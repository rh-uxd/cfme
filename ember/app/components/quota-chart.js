import Ember from 'ember';

export default Ember.Component.extend({

  title: '',
  usedUnits: function() {
    return this.get('data').usedUnits;
  }.property('data.usedUnits'),

  totalUnits: function() {
    return this.get('data').totalUnits;
  }.property('data.totalUnits'),

  usedPercent: function() {
    return Math.round(this.get('usedUnits') / this.get('totalUnits') * 100);
  }.property('usedUnits', 'totalUnits')
});
