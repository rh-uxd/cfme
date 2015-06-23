define('dashboard/controllers/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    nodeHeatMapUsageLegendLabels: (function () {
      return ['< 70%', '70-80%', '80-90%', '> 90%'];
    }).property(),
    nodeHeatMapNetworkLegendLabels: (function () {
      return ['Very High', 'High', 'Low', 'Very Low'];
    }).property()
  });

});