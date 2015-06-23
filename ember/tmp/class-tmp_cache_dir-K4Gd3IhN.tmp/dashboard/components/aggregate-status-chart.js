define('dashboard/components/aggregate-status-chart', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({

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

});