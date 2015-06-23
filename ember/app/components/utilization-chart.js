import Ember from 'ember';
import ChartsMixin from "../mixins/charts-mixin";

export default Ember.Component.extend(ChartsMixin, {

  title: "",
  totalUnits: '',
  data: {},
  usageDataName: 'Used',

  // radialParentHeight: 120,
  // radialChartMargin: 10,

  used: function() {
    var data = this.get('data');
    if (!data) {
      return 0;
    }
    return data.used;
  }.property('data','data.used'),

  total: function() {
    var data = this.get('data');
    if (!data) {
      return 0;
    }
    return data.total;
  }.property('data','data.total'),

  numDays: function() {
    var data = this.get('data');
    if (!data || !data.data) {
      return 0;
    }
    return data.data.length;
  }.property('data','data.data','data.data.length'),

  available: function() {
    return this.get('total') - this.get('used');
  }.property('used', 'total'),
  availableUnits: '',

  percentUsed: function() {
    return this.get('used') / this.get('total') * 100.0;
  }.property('used', 'total'),

  percentAvailable: function() {
    return this.get('available') / this.get('total') * 100.0;
  }.property('available', 'total'),

  legendLeftText: function() {
    return "Last " + this.get('numDays') + " Days";
  }.property('numDays'),

  legendRightText: function() {
    return Math.round(this.get('percentUsed')) + "%";
  }.property('percentUsed'),

  radial_title: function() {
    return this.get('used');
  }.property('used'),

  radial_donut: function() {
    return this.get('default_radial_donut');
  }.property('default_radial_donut'),

  radial_size: function() {
    return this.get('default_radial_size');
  }.property(),

  getStatusColor: function(used) {
    if (used >= 90.0)
    {
      return '#CC0000';
    }
    else if (used >= 75.0)
    {
      return '#EC7A08';
    }
    else {
      return '#0088CE';
    }
  },

  radial_color: function() {
    var color = {
      pattern: []
    };
    var percentUsed = this.get('used') / this.get('total') * 100.0;
    color.pattern[0] =  this.getStatusColor(percentUsed);
    color.pattern[1] = '#D1D1D1';

    return color;
  }.property(),

  radial_tooltip: function() {
    var me = this;
    return {
      contents: function (d) {
        return '<span class="c3-tooltip-sparkline" style="white-space: nowrap;">' + Math.round(d[0].ratio * 100) + '%:</span>' +
               '<span class="c3-tooltip-sparkline" style="white-space: nowrap;">' + d[0].value + ' ' + me.get('totalUnits') + ' ' + d[0].name + '</span>';
      }
    };
  }.property(),

  radial_legend: function() {
    return this.get('default_radial_legend');
  }.property(),

  radial_data : function() {
    return {
      columns: [
        ['Used', this.get('used')],
        ['Available', this.get('available')]
      ],
      type: 'donut',
      donut: {
        label: {
          show: false
        }
      },
      groups: [
        ['used', 'available']
      ],
      order: null
    };
  }.property(),

  sparkline_settings: function() {
    return this.get('default_sparkline_settings');
  }.property(),
  sparkline_size: function() {
    return this.get('default_sparkline_size');
  }.property(),
  sparkline_color: function() {
    return this.get('default_sparkline_color');
  }.property(),
  sparkline_point: function() {
    return {
      show: false,
      r: 20
    };
  }.property(),
  sparkline_tooltip_fn: function(data) {
    return data.value + ' ' + this.get('usageDataName');
  },
  sparkline_tooltip: function() {
    var me = this;
    return {
      contents: function (d) {
        var percentUsed = Math.round(d[0].value / me.get('total') * 100.0);

        return '<div id="utilization-sparkline-tooltip" class="module-triangle-bottom">' +
          '<table class="c3-tooltip">' +
          '  <tbody>' +
          '    <tr>' +
          '      <th colspan="2">' + d[0].x.toLocaleDateString() + '</th>' +
          '    </tr>' +
          '    <tr>' +
          '      <td class="name">' +
                   percentUsed + '%:' +
          '      </td>' +
          '      <td class="value" style="white-space: nowrap;">' +
                   d[0].value + ' ' + me.get('totalUnits') + ' ' + d[0].name +
                '</td>' +
          '    </tr>' +
          '  </tbody>' +
          '</table>' +
          '</div>';
      },
      position: function (data, width, height, element) {
        var center = parseInt(element.getAttribute('x'));
        var top = parseInt(element.getAttribute('y'));
        var chartBox = document.querySelector("#sparklineChart").getBoundingClientRect();
        var graphOffsetX = document.querySelector("#sparklineChart g.c3-axis-y").getBoundingClientRect().right;

        var x = Math.max( 0, center + graphOffsetX - chartBox.left - Math.floor(width/2));
        x = Math.min(x, chartBox.width - width);
        var y = top - height;

        return {top: y, left: x};
      }
    };
  }.property(),

  sparkline_legend: function() {
    return this.get('default_sparkline_legend');
  }.property(),
   sparkline_axis: function() {
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

  sparkline_data: function() {
    var usage = [this.get('usageDataName')];
    var dates = ['dates'];
    var data = this.get('data');

    if (data)
    {
      usage.pushObjects(data.data);

      if (data.dates && data.dates.length > 0) {
        for (var i=0; i<data.dates.length; i++) {
          dates.pushObject(new Date(data.dates[i]));
        }
      }
      else {
        // Use fake dates
        var today = new Date();
        for (var d=data.data.length - 1; d>=0; d--) {
          dates.pushObject(new Date(today.getTime() - (d * 24 * 60 * 60 * 1000)));
        }
      }
    }

    return {
      x: 'dates',
      columns: [
        dates,
        usage
      ],
      type: 'area'
    };
  }.property('data','data.data','usageDataName'),

  setupRadialChartTitle: function () {
    var radialChartTitle = this.$('text.c3-chart-arcs-title')[0];
    radialChartTitle.innerHTML = '<tspan dy="0" x="0" class="utilization-chart-title-big">' + this.get('used') + '</tspan>' +
    '<tspan dy="20" x="0" class="utilization-chart-title-small">' + this.get('totalUnits') + ' Used</tspan>';
  },

  didInsertElement: function ()
  {
    this.setupRadialChartTitle();
    this.resizeNotificationService.on( 'windowResizedLowLatency',
      this, this.handleResize );
  },

  willDestroyElement: function() {
    this.resizeNotificationService.off( 'windowResizedLowLatency',
      this, this.handleResize );
  },

  handleResize: function() {
  /*
    console.dir(this.$('#radial-chart-container'));
    console.log("Parent: " + this.$('#radial-chart-container').width());
    this.set('radialParentHeight' , this.$('#radial-chart-container').height());
  */
  },

  updateTitle:function() {
    this.setupRadialChartTitle();
  }.observes('used', 'totalUnits')

});
