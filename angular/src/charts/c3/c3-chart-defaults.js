'use strict';
angular.module('patternfly.charts').constant('cfmeChartDefaults', {
 
  /*
   * Points
   */

  getDefaultPoint: function() {
    return {
      show: true,
      r: 5
    };
  },

  /*
   *  Area Chart Defaults
   */
  getDefaultAreaArea: function() {
    return {
      zerobased: true
    };
  },

  getDefaultAreaSize: function() {
    return {
      height: 100
    };
  },

  getDefaultAreaPoint: function() {
    return {
      r: 1,
      focus: {
        expand: {
          r: 4
        }
      }
    };
  },

  getDefaultAreaColor: function() {
    return {
      pattern: ['#3f9c35', '#ec7a08', '#0088ce', '#00659c', '#cc0000']
    };
  },

  getDefaultAreaLegend: function() {
    return {
      show: false
    };
  },

  getDefaultAreaTooltip: function() {
    return {
      show: false
    };
  },

  getDefaultAreaConfig: function() {
    return {
      area: this.getDefaultAreaArea(),
      size: this.getDefaultAreaSize(),
      point: this.getDefaultAreaPoint(),
      color: this.getDefaultAreaColor(),
      legend: this.getDefaultAreaLegend(),
      tooltip: this.getDefaultRadialTooltip()
    };
  },

// Heat Maps
  getDefaultHeatmapColorPattern: function() {
    return ['#d4f0fa', '#F9D67A', '#EC7A08', '#CE0000'];
  },

  defaultHeatmapBlockPadding: 1,
  getDefaultHeatmapColor: function() {
    return d3.scale.threshold().domain([0.7, 0.8, 0.9]).range(this.getDefaultHeatmapColorPattern());
  }
});
