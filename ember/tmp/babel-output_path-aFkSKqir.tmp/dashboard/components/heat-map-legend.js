import Ember from 'ember';
import ChartsMixin from '../mixins/charts-mixin';

export default Ember.Component.extend(ChartsMixin, {

  legendItems: [],

  legendLabels: [],
  legendColors: (function () {
    return this.get('default_heatmap_color_pattern');
  }).property(),

  _legendItems: (function () {
    var legendItems = this.get('legendItems');
    if (legendItems && legendItems.length > 0) {
      return legendItems;
    }

    var items = [];
    var legendLabels = this.get('legendLabels');
    var legendColors = this.get('legendColors');

    if (legendLabels) {
      for (var i = legendLabels.length - 1; i >= 0; i--) {
        items.pushObject({ text: legendLabels[i], color: legendColors[i] });
      }
    }

    return items;
  }).property()

});