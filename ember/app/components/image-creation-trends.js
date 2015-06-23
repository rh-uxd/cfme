import Ember from 'ember';
import ChartsMixin from "../mixins/charts-mixin";

export default Ember.Component.extend(ChartsMixin, {

  title: "Image Creation Trends",
  sizeUnits: 'GB',
  data: {},

  chart_axis: function () {
    return {
      x: {
        show: false,
        type: 'timeseries',
        tick: {
          format: '%Y-%m-%d'
        }
      },
      y: {
        show: false
      }
    };
  }.property(),

  chart_color: function () {
    return {
      pattern: ['#6ca100', '#0088ce']
    };
  }.property(),

  chart_data: function () {
    var totalImages = ['Images'];
    var totalSize = ['Total Size'];
    var dates = ['dates'];
    var data = this.get('data');

    if (data)
    {
      totalImages.pushObjects(data.totalImages);
      totalSize.pushObjects(data.totalSize);

      if (data.dates && data.dates.length > 0) {
        for (var i=0; i<data.dates.length; i++) {
          dates.pushObject(new Date(data.dates[i]));
        }
      }
      else {
        // Use fake dates
        var today = new Date();
        for (var d=data.totalImages.length - 1; d>=0; d--) {
          dates.pushObject(new Date(today.getTime() - (d * 24 * 60 * 60 * 1000)));
        }
      }
    }

    return {
      x: 'dates',
      columns: [
        dates,
        totalImages,
        totalSize
      ],
      axes: {
        'Images': 'y',
        'Total Size': 'y2'
      },
      type: 'area'
    };
  }.property('data'),

  chart_point: function () {
    return {
      show: false
    };
  }.property(),

  chart_size: function () {
    return {
      height: 70
    };
  }.property(),

  chart_legend: function() {

  }.property(),

  chart_tooltip: function() {
    var me = this;
    return {
      contents: function (d) {
        return '<div id="sparkline-tooltip">' +
          '<table class="c3-tooltip">' +
          '  <tbody>' +
          '    <tr>' +
          '      <th colspan="2">' + d[0].x.toLocaleDateString() + '</th>' +
          '    </tr>' +
          '    <tr">' +
          '      <td class="name">' +
          '        <span style="background-color:' + me.get('chart_color').pattern[0] + '"></span>' +
                   d[0].name + ':' +
          '      </td>' +
          '      <td class="value" style="white-space: nowrap;">' +
                   d[0].value +
          '      </td>' +
          '    </tr>' +
          '    <tr">' +
          '      <div style="background-color:' + me.get('chart_color').pattern[1] + '"> </div>' +
          '      <td class="name">' +
          '        <span style="background-color:' + me.get('chart_color').pattern[1] + '"></span>' +
                   d[1].name + ':' +
          '      </td>' +
          '      <td class="value" style="white-space: nowrap;">' +
                   d[1].value + ' ' + me.get('sizeUnits')  +
          '      </td>' +
          '    </tr>' +
          '  </tbody>' +
          '</table>' +
          '</div>';
      },
      position: function (data, width, height, element) {
        var center = parseInt(element.getAttribute('x'));
        var chart = me.$('#sparklineChart');
        var yAxis = me.$("#sparklineChart g.c3-axis-y");

        var chartBox = chart[0].getBoundingClientRect();
        var graphOffset = yAxis[0].getBoundingClientRect();

        var top = parseInt(element.getAttribute('y'));
        var left = Math.max(0, center + graphOffset.right - chartBox.left - Math.floor(width/2));

        return {
          top: top - height,
          left: Math.min(left, chartBox.width - width)
        };
      }
    };
  }.property()
});
