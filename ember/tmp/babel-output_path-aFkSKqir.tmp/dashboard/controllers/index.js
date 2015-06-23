import Ember from 'ember';

export default Ember.Controller.extend({
  nodeHeatMapUsageLegendLabels: (function () {
    return ['< 70%', '70-80%', '80-90%', '> 90%'];
  }).property(),
  nodeHeatMapNetworkLegendLabels: (function () {
    return ['Very High', 'High', 'Low', 'Very Low'];
  }).property()
});