define('dashboard/components/container-group-creation-trends', ['exports', 'ember', 'dashboard/mixins/charts-mixin'], function (exports, Ember, ChartsMixin) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend(ChartsMixin['default'], {

    title: "Container Group Trends",
    data: {},

    chart_axis: (function () {
      return {
        x: {
          show: false,
          type: "timeseries",
          tick: {
            format: "%Y-%m-%d"
          }
        },
        y: {
          show: false
        }
      };
    }).property(),

    chart_color: (function () {
      return {
        pattern: ["#6ca100", "#0088ce"]
      };
    }).property(),

    chart_data: (function () {
      var creations = ["Created"];
      var deletions = ["Deleted"];
      var dates = ["dates"];
      var data = this.get("data");

      if (data) {
        creations.pushObjects(data.creations);
        deletions.pushObjects(data.deletions);

        if (data.dates && data.dates.length > 0) {
          for (var i = 0; i < data.dates.length; i++) {
            dates.pushObject(new Date(data.dates[i]));
          }
        } else {
          // Use fake dates
          var today = new Date();
          for (var d = data.creations.length - 1; d >= 0; d--) {
            dates.pushObject(new Date(today.getTime() - d * 24 * 60 * 60 * 1000));
          }
        }
      }

      return {
        x: "dates",
        columns: [dates, creations, deletions],
        type: "area"
      };
    }).property("data"),

    chart_point: (function () {
      return {
        show: false
      };
    }).property(),

    chart_size: (function () {
      return {
        height: 74
      };
    }).property(),

    chart_legend: (function () {}).property(),

    chart_tooltip: (function () {
      var me = this;
      return {
        contents: function contents(d) {
          return "<div id=\"sparkline-tooltip\">" + "<table class=\"c3-tooltip\">" + "  <tbody>" + "    <tr>" + "      <th colspan=\"2\">" + d[0].x.toLocaleDateString() + "</th>" + "    </tr>" + "    <tr\">" + "      <td class=\"name\">" + "        <span style=\"background-color:" + me.get("chart_color").pattern[0] + "\"></span>" + d[0].name + ":" + "      </td>" + "      <td class=\"value\" style=\"white-space: nowrap;\">" + "         +" + d[0].value + " Pods" + "      </td>" + "    </tr>" + "    <tr\">" + "      <div style=\"background-color:" + me.get("chart_color").pattern[1] + "\"> </div>" + "      <td class=\"name\">" + "        <span style=\"background-color:" + me.get("chart_color").pattern[1] + "\"></span>" + d[1].name + ":" + "      </td>" + "      </td>" + "      <td class=\"value\" style=\"white-space: nowrap;\">" + "         -" + d[1].value + " Pods" + "      </td>" + "    </tr>" + "  </tbody>" + "</table>" + "</div>";
        },
        position: function position(data, width, height, element) {
          var center = parseInt(element.getAttribute("x"));
          var chart = me.$("#sparklineChart");
          var yAxis = me.$("#sparklineChart g.c3-axis-y");

          var chartBox = chart[0].getBoundingClientRect();
          var graphOffset = yAxis[0].getBoundingClientRect();

          var top = parseInt(element.getAttribute("y"));
          var left = Math.max(0, center + graphOffset.right - chartBox.left - Math.floor(width / 2));

          return {
            top: top - height,
            left: Math.min(left, chartBox.width - width)
          };
        }
      };
    }).property()

  });

});