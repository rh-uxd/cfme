define('dashboard/components/quota-chart', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({

    title: '',
    usedUnits: (function () {
      return this.get('data').usedUnits;
    }).property('data.usedUnits'),

    totalUnits: (function () {
      return this.get('data').totalUnits;
    }).property('data.totalUnits'),

    usedPercent: (function () {
      return Math.round(this.get('usedUnits') / this.get('totalUnits') * 100);
    }).property('usedUnits', 'totalUnits')
  });

});