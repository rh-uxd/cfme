import Ember from 'ember';

export default Ember.Mixin.create({

  // Point Defaults (line type charts)
  default_point: (function () {
    return {
      show: true,
      r: 5
    };
  }).property(),

  // Radial Chart Defaults
  default_radial_donut: (function () {
    return {
      title: this.get('radial_title'),
      label: {
        show: false
      },
      width: 10
    };
  }).property(),
  default_radial_size: (function () {
    return {
      height: 130
    };
  }).property(),
  default_radial_color: (function () {
    return {
      pattern: ['#0088CE', '#D1D1D1']
    };
  }).property(),
  default_radial_tooltip: (function () {
    return {
      show: false
    };
  }).property(),
  default_radial_legend: (function () {
    return {
      show: false
    };
  }).property(),

  // Area Chart Defaults

  default_area_settings: (function () {
    return {
      zerobased: true
    };
  }).property(),
  default_area_size: (function () {
    return {
      height: 100
    };
  }).property(),
  default_area_color: (function () {
    return {
      pattern: ['#3f9c35', '#ec7a08', '#0088ce', '#00659c', '#cc0000']
    };
  }).property(),
  default_area_tooltip: (function () {
    return {
      show: false
    };
  }).property(),
  default_area_legend: (function () {
    return {
      show: false
    };
  }).property(),
  default_area_point: (function () {
    return {
      r: 1,
      focus: {
        expand: {
          r: 4
        }
      }
    };
  }).property(),

  // Sparkline Chart Defaults

  default_sparkline_settings: (function () {
    return {
      zerobased: true
    };
  }).property(),
  default_sparkline_axis: (function () {
    return {
      x: {
        show: false
      },
      y: {
        show: false
      }
    };
  }).property(),
  default_sparkline_color: (function () {
    return {
      pattern: ['#0088ce', '#00659c', '#3f9c35', '#ec7a08', '#cc0000']
    };
  }).property(),
  default_sparkline_legend: (function () {
    return {
      show: false
    };
  }).property(),
  default_sparkline_point: (function () {
    return {
      r: 1,
      focus: {
        expand: {
          r: 4
        }
      }
    };
  }).property(),
  default_sparkline_size: (function () {
    return {
      height: 40
    };
  }).property(),
  // Change this value to change the tooltip
  sparkline_tooltip_fn: function sparkline_tooltip_fn(data) {
    return data.value;
  },
  default_sparkline_tooltip: (function () {
    var me = this;
    return {
      // because a sparkline should only contain a single data column, the tooltip will only work for a single data column
      contents: function contents(d) {
        return '<span class="c3-tooltip-sparkline">' + me.sparkline_tooltip_fn(d[0]) + '</span>';
      }
    };
  }).property(),

  // Heat Maps
  default_heatmap_color_pattern: (function () {
    return ['#d4f0fa', '#F9D67A', '#EC7A08', '#CE0000'];
  }).property(),

  default_heatmap_block_padding: 1,
  default_heatmap_color: (function () {
    return d3.scale.threshold().domain([0.7, 0.8, 0.9]).range(this.get('default_heatmap_color_pattern'));
  }).property()

});