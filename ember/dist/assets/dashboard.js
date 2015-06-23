/* jshint ignore:start */

/* jshint ignore:end */

define('dashboard/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'dashboard/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  var App;

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
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
define('dashboard/components/bread-crumb-bar', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    breadCrumbs: [],
    navBarHeight: 105,
    navBarId: 'appNavBar',
    breadCrumbBarId: 'breadCrumbBar',
    topPosition: 0,
    topFudge: -3,

    didInsertElement: function didInsertElement() {
      var breadCrumbs = this.get('breadCrumbs');
      if (breadCrumbs && breadCrumbs.length > 0) {
        var self = this;
        Ember['default'].run.later(function () {
          self.set('navBarHeight', $('#appNavBar').height());
          self.set('topPosition', self.get('navBarHeight') - self.get('topFudge'));
          self.set('breadCrumbBarHeight', $('#breadCrumbBar').height());

          var totalHeight = self.get('navBarHeight') + self.get('breadCrumbBarHeight') - self.get('topFudge');
          document.body.style.padding = totalHeight + 'px 0 0 0';
        }, 100);
      }
    },

    willDestroyElement: function willDestroyElement() {
      document.body.style.padding = this.get('navBarHeight') + 'px 0 0 0';
    }
  });

});
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
define('dashboard/components/heat-map-legend', ['exports', 'ember', 'dashboard/mixins/charts-mixin'], function (exports, Ember, ChartsMixin) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend(ChartsMixin['default'], {

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

});
define('dashboard/components/heat-map', ['exports', 'ember', 'dashboard/mixins/charts-mixin'], function (exports, Ember, ChartsMixin) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend(ChartsMixin['default'], {

    tagName: 'svg',
    attributeBindings: ['width', 'height'],

    blockPadding: Ember['default'].computed(function () {
      return this.get('default_heatmap_block_padding');
    }),

    color: Ember['default'].computed(function () {
      return this.get('default_heatmap_color');
    }),

    rows: Ember['default'].computed('height', 'blockSize', function () {
      var blockSize = this.get('blockSize');
      return blockSize === 0 ? 0 : Math.floor(this.get('height') / blockSize);
    }),

    blockSize: 0,

    determineBlockSize: function determineBlockSize() {
      var x = this.get('width');
      var y = this.get('height');
      var n = this.get('data').length;

      var px = Math.ceil(Math.sqrt(n * x / y));
      var py = Math.ceil(Math.sqrt(n * y / x));
      var sx, sy;

      if (Math.floor(px * y / x) * px < n) {
        sx = y / Math.ceil(px * y / x);
      } else {
        sx = x / px;
      }

      if (Math.floor(py * x / y) * py < n) {
        sy = x / Math.ceil(x * py / y);
      } else {
        sy = y / py;
      }

      return Math.max(sx, sy);
    },

    redrawTrigger: Ember['default'].observer('blockSize', 'blockPadding', 'color', function () {
      Ember['default'].run.once(this, 'redraw');
    }),

    didInsertElement: function didInsertElement() {
      this.set('width', this.$().parents('div').width());
      this.set('height', this.$().parents('div').height());
      this.set('blockSize', this.determineBlockSize());
      this.redraw();
      this.resizeNotificationService.on('windowResizedLowLatency', this, this.handleResize);
    },

    willDestroyElement: function willDestroyElement() {
      this.resizeNotificationService.off('windowResizedLowLatency', this, this.handleResize);
    },

    handleResize: function handleResize() {
      this.set('width', this.$().parents('div').width());
      this.set('height', this.$().parents('div').height());
      this.set('blockSize', this.determineBlockSize());
      this.redraw();
    },

    redraw: function redraw() {
      var data = this.get('data');
      var rows = this.get('rows');
      var blockSize = this.get('blockSize');
      var blockPadding = this.get('blockPadding');
      var color = this.get('color');
      var component = this;

      function highlightBlock(block, active) {
        block.style('fill-opacity', active ? 1 : 0.4);
      }

      var svg = d3.select(this.element);
      svg.selectAll('*').remove();

      var blocks = svg.selectAll('rect').data(data).enter().append('rect');

      blocks.attr('x', function (d, i) {
        return Math.floor(i / rows) * blockSize + blockPadding;
      }).attr('y', function (d, i) {
        return i % rows * blockSize + blockPadding;
      }).attr('width', blockSize - 2 * blockPadding).attr('height', blockSize - 2 * blockPadding).style('fill', function (d) {
        return color(d.value);
      });

      blocks.on('mouseover', function () {
        blocks.call(highlightBlock, false);

        d3.select(this).call(highlightBlock, true);
      });

      blocks.on('click', function (d) {
        component.sendAction('click', d);
      });

      blocks.each(function (d) {
        $(this).tooltip({
          container: 'body',
          animation: false,
          placement: 'top',
          trigger: 'hover',
          html: true,
          title: d.tooltip
        });
      });

      svg.on('mouseleave', function () {
        blocks.call(highlightBlock, true);
      });
    }

  });

});
define('dashboard/components/image-creation-trends', ['exports', 'ember', 'dashboard/mixins/charts-mixin'], function (exports, Ember, ChartsMixin) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend(ChartsMixin['default'], {

    title: "Image Creation Trends",
    sizeUnits: "GB",
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
      var totalImages = ["Images"];
      var totalSize = ["Total Size"];
      var dates = ["dates"];
      var data = this.get("data");

      if (data) {
        totalImages.pushObjects(data.totalImages);
        totalSize.pushObjects(data.totalSize);

        if (data.dates && data.dates.length > 0) {
          for (var i = 0; i < data.dates.length; i++) {
            dates.pushObject(new Date(data.dates[i]));
          }
        } else {
          // Use fake dates
          var today = new Date();
          for (var d = data.totalImages.length - 1; d >= 0; d--) {
            dates.pushObject(new Date(today.getTime() - d * 24 * 60 * 60 * 1000));
          }
        }
      }

      return {
        x: "dates",
        columns: [dates, totalImages, totalSize],
        axes: {
          "Images": "y",
          "Total Size": "y2"
        },
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
        height: 70
      };
    }).property(),

    chart_legend: (function () {}).property(),

    chart_tooltip: (function () {
      var me = this;
      return {
        contents: function contents(d) {
          return "<div id=\"sparkline-tooltip\">" + "<table class=\"c3-tooltip\">" + "  <tbody>" + "    <tr>" + "      <th colspan=\"2\">" + d[0].x.toLocaleDateString() + "</th>" + "    </tr>" + "    <tr\">" + "      <td class=\"name\">" + "        <span style=\"background-color:" + me.get("chart_color").pattern[0] + "\"></span>" + d[0].name + ":" + "      </td>" + "      <td class=\"value\" style=\"white-space: nowrap;\">" + d[0].value + "      </td>" + "    </tr>" + "    <tr\">" + "      <div style=\"background-color:" + me.get("chart_color").pattern[1] + "\"> </div>" + "      <td class=\"name\">" + "        <span style=\"background-color:" + me.get("chart_color").pattern[1] + "\"></span>" + d[1].name + ":" + "      </td>" + "      <td class=\"value\" style=\"white-space: nowrap;\">" + d[1].value + " " + me.get("sizeUnits") + "      </td>" + "    </tr>" + "  </tbody>" + "</table>" + "</div>";
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
define('dashboard/components/object-status-chart', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    typeIconClass: '',
    objectCount: 0,
    objectType: '',
    linkRoute: null,

    hasRoute: (function () {
      var linkRoute = this.get('linkRoute');
      return linkRoute !== null;
    }).property('linkRoute'),

    isSVG: (function () {
      return this.get('typeIconClass').indexOf('.svg') !== -1;
    }).property('typeIconClass'),

    objectId: 1
  });

});
define('dashboard/components/provider-type-tile', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({

    providerType: null,

    isOpenShift: (function () {
      return this.get('providerType') === 'openshift';
    }).property('providerType'),

    isKubernetes: (function () {
      return this.get('providerType') === 'kubernetes';
    }).property('providerType')
  });

});
define('dashboard/components/providers-status-chart', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({

    openShiftCount: 0,
    kubernetesCount: 0,

    numProviders: (function () {
      return this.get('openShiftCount') + this.get('kubernetesCount');
    }).property('openShiftCount', 'kubernetesCount'),

    openshiftTooltip: (function () {
      var count = this.get('openShiftCount');
      if (count === 1) {
        return '1 OpenShift Provider';
      } else {
        return count + 'OpenShift Providers';
      }
    }).property('openShiftCount'),

    kubernetesTooltip: (function () {
      var count = this.get('kubernetesCount');
      if (count === 1) {
        return '1 Kubernetes Provider';
      } else {
        return count + 'Kubernetes Providers';
      }
    }).property('kubernetesCount')
  });

});
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
define('dashboard/components/utilization-chart', ['exports', 'ember', 'dashboard/mixins/charts-mixin'], function (exports, Ember, ChartsMixin) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend(ChartsMixin['default'], {

    title: "",
    totalUnits: "",
    data: {},
    usageDataName: "Used",

    // radialParentHeight: 120,
    // radialChartMargin: 10,

    used: (function () {
      var data = this.get("data");
      if (!data) {
        return 0;
      }
      return data.used;
    }).property("data", "data.used"),

    total: (function () {
      var data = this.get("data");
      if (!data) {
        return 0;
      }
      return data.total;
    }).property("data", "data.total"),

    numDays: (function () {
      var data = this.get("data");
      if (!data || !data.data) {
        return 0;
      }
      return data.data.length;
    }).property("data", "data.data", "data.data.length"),

    available: (function () {
      return this.get("total") - this.get("used");
    }).property("used", "total"),
    availableUnits: "",

    percentUsed: (function () {
      return this.get("used") / this.get("total") * 100.0;
    }).property("used", "total"),

    percentAvailable: (function () {
      return this.get("available") / this.get("total") * 100.0;
    }).property("available", "total"),

    legendLeftText: (function () {
      return "Last " + this.get("numDays") + " Days";
    }).property("numDays"),

    legendRightText: (function () {
      return Math.round(this.get("percentUsed")) + "%";
    }).property("percentUsed"),

    radial_title: (function () {
      return this.get("used");
    }).property("used"),

    radial_donut: (function () {
      return this.get("default_radial_donut");
    }).property("default_radial_donut"),

    radial_size: (function () {
      return this.get("default_radial_size");
    }).property(),

    getStatusColor: function getStatusColor(used) {
      if (used >= 90.0) {
        return "#CC0000";
      } else if (used >= 75.0) {
        return "#EC7A08";
      } else {
        return "#0088CE";
      }
    },

    radial_color: (function () {
      var color = {
        pattern: []
      };
      var percentUsed = this.get("used") / this.get("total") * 100.0;
      color.pattern[0] = this.getStatusColor(percentUsed);
      color.pattern[1] = "#D1D1D1";

      return color;
    }).property(),

    radial_tooltip: (function () {
      var me = this;
      return {
        contents: function contents(d) {
          return "<span class=\"c3-tooltip-sparkline\" style=\"white-space: nowrap;\">" + Math.round(d[0].ratio * 100) + "%:</span>" + "<span class=\"c3-tooltip-sparkline\" style=\"white-space: nowrap;\">" + d[0].value + " " + me.get("totalUnits") + " " + d[0].name + "</span>";
        }
      };
    }).property(),

    radial_legend: (function () {
      return this.get("default_radial_legend");
    }).property(),

    radial_data: (function () {
      return {
        columns: [["Used", this.get("used")], ["Available", this.get("available")]],
        type: "donut",
        donut: {
          label: {
            show: false
          }
        },
        groups: [["used", "available"]],
        order: null
      };
    }).property(),

    sparkline_settings: (function () {
      return this.get("default_sparkline_settings");
    }).property(),
    sparkline_size: (function () {
      return this.get("default_sparkline_size");
    }).property(),
    sparkline_color: (function () {
      return this.get("default_sparkline_color");
    }).property(),
    sparkline_point: (function () {
      return {
        show: false,
        r: 20
      };
    }).property(),
    sparkline_tooltip_fn: function sparkline_tooltip_fn(data) {
      return data.value + " " + this.get("usageDataName");
    },
    sparkline_tooltip: (function () {
      var me = this;
      return {
        contents: function contents(d) {
          var percentUsed = Math.round(d[0].value / me.get("total") * 100.0);

          return "<div id=\"utilization-sparkline-tooltip\" class=\"module-triangle-bottom\">" + "<table class=\"c3-tooltip\">" + "  <tbody>" + "    <tr>" + "      <th colspan=\"2\">" + d[0].x.toLocaleDateString() + "</th>" + "    </tr>" + "    <tr>" + "      <td class=\"name\">" + percentUsed + "%:" + "      </td>" + "      <td class=\"value\" style=\"white-space: nowrap;\">" + d[0].value + " " + me.get("totalUnits") + " " + d[0].name + "</td>" + "    </tr>" + "  </tbody>" + "</table>" + "</div>";
        },
        position: function position(data, width, height, element) {
          var center = parseInt(element.getAttribute("x"));
          var top = parseInt(element.getAttribute("y"));
          var chartBox = document.querySelector("#sparklineChart").getBoundingClientRect();
          var graphOffsetX = document.querySelector("#sparklineChart g.c3-axis-y").getBoundingClientRect().right;

          var x = Math.max(0, center + graphOffsetX - chartBox.left - Math.floor(width / 2));
          x = Math.min(x, chartBox.width - width);
          var y = top - height;

          return { top: y, left: x };
        }
      };
    }).property(),

    sparkline_legend: (function () {
      return this.get("default_sparkline_legend");
    }).property(),
    sparkline_axis: (function () {
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

    sparkline_data: (function () {
      var usage = [this.get("usageDataName")];
      var dates = ["dates"];
      var data = this.get("data");

      if (data) {
        usage.pushObjects(data.data);

        if (data.dates && data.dates.length > 0) {
          for (var i = 0; i < data.dates.length; i++) {
            dates.pushObject(new Date(data.dates[i]));
          }
        } else {
          // Use fake dates
          var today = new Date();
          for (var d = data.data.length - 1; d >= 0; d--) {
            dates.pushObject(new Date(today.getTime() - d * 24 * 60 * 60 * 1000));
          }
        }
      }

      return {
        x: "dates",
        columns: [dates, usage],
        type: "area"
      };
    }).property("data", "data.data", "usageDataName"),

    setupRadialChartTitle: function setupRadialChartTitle() {
      var radialChartTitle = this.$("text.c3-chart-arcs-title")[0];
      radialChartTitle.innerHTML = "<tspan dy=\"0\" x=\"0\" class=\"utilization-chart-title-big\">" + this.get("used") + "</tspan>" + "<tspan dy=\"20\" x=\"0\" class=\"utilization-chart-title-small\">" + this.get("totalUnits") + " Used</tspan>";
    },

    didInsertElement: function didInsertElement() {
      this.setupRadialChartTitle();
      this.resizeNotificationService.on("windowResizedLowLatency", this, this.handleResize);
    },

    willDestroyElement: function willDestroyElement() {
      this.resizeNotificationService.off("windowResizedLowLatency", this, this.handleResize);
    },

    handleResize: function handleResize() {},

    updateTitle: (function () {
      this.setupRadialChartTitle();
    }).observes("used", "totalUnits")

  });

  /*
    console.dir(this.$('#radial-chart-container'));
    console.log("Parent: " + this.$('#radial-chart-container').width());
    this.set('radialParentHeight' , this.$('#radial-chart-container').height());
  */

});
define('dashboard/controllers/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    appName: 'Dashboard'
  });

});
define('dashboard/controllers/array', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('dashboard/controllers/containers/projects', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    queryParams: ['id'],
    id: 1,

    getTypeIcon: function getTypeIcon(providerType) {
      if (providerType === 'openshift') {
        return 'pficon-openshift';
      }
      if (providerType === 'kubernetes') {
        return 'pficon-kubernetes';
      }
      return null;
    },

    crumbs: (function () {
      return [{
        isActive: true,
        route: 'index',
        title: 'Projects'
      }, {
        isActive: false,
        title: this.get('model').name,
        suffix: this.get('model').provider.name,
        suffixIconClass: this.getTypeIcon(this.get('model').provider.providerType)
      }];
    }).property('model', 'model.name', 'model.provider.name', 'model.provider.providerType'),

    nodeHeatMapUsageLegendLabels: (function () {
      return ['< 70%', '70-80%', '80-90%', '> 90%'];
    }).property(),
    nodeHeatMapNetworkLegendLabels: (function () {
      return ['Very High', 'High', 'Low', 'Very Low'];
    }).property()
  });

});
define('dashboard/controllers/containers/providers', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    queryParams: ['provider_type'],
    provider_type: null,
    crumbs: (function () {
      return [{
        isActive: true,
        route: 'index',
        title: 'Container Providers'
      }, {
        isActive: false,
        route: '',
        title: this.get('providerTitle')
      }];
    }).property('providerTitle'),

    providerTitle: (function () {
      if (this.get('isOpenShift')) {
        return 'OpenShift';
      } else {
        return 'Kubernetes';
      }
    }).property('isOpenShift'),

    isOpenShift: (function () {
      return this.get('provider_type') === 'openshift';
    }).property('provider_type'),

    isKubernetes: (function () {
      return this.get('provider_type') === 'kubernetes';
    }).property('provider_type'),

    projectId: (function () {
      if (this.get('isOpenShift')) {
        return 1;
      } else {
        return 2;
      }
    }).property('provider_type'),

    providerCount: (function () {
      return this.get('model').count;
    }).property('model.count'),

    nodeHeatMapUsageLegendLabels: (function () {
      return ['< 70%', '70-80%', '80-90%', '> 90%'];
    }).property(),
    nodeHeatMapNetworkLegendLabels: (function () {
      return ['Very High', 'High', 'Low', 'Very Low'];
    }).property()
  });

});
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
define('dashboard/controllers/object', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('dashboard/controllers/sample-charts', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller.extend({});

});
define('dashboard/helpers/fa-icon', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var FA_PREFIX = /^fa\-.+/;

  var warn = Ember['default'].Logger.warn;

  /**
   * Handlebars helper for generating HTML that renders a FontAwesome icon.
   *
   * @param  {String} name    The icon name. Note that the `fa-` prefix is optional.
   *                          For example, you can pass in either `fa-camera` or just `camera`.
   * @param  {Object} options Options passed to helper.
   * @return {Ember.Handlebars.SafeString} The HTML markup.
   */
  var faIcon = function faIcon(name, options) {
    if (Ember['default'].typeOf(name) !== 'string') {
      var message = 'fa-icon: no icon specified';
      warn(message);
      return Ember['default'].String.htmlSafe(message);
    }

    var params = options.hash,
        classNames = [],
        html = '';

    classNames.push('fa');
    if (!name.match(FA_PREFIX)) {
      name = 'fa-' + name;
    }
    classNames.push(name);
    if (params.spin) {
      classNames.push('fa-spin');
    }
    if (params.flip) {
      classNames.push('fa-flip-' + params.flip);
    }
    if (params.rotate) {
      classNames.push('fa-rotate-' + params.rotate);
    }
    if (params.lg) {
      warn('fa-icon: the \'lg\' parameter is deprecated. Use \'size\' instead. I.e. {{fa-icon size="lg"}}');
      classNames.push('fa-lg');
    }
    if (params.x) {
      warn('fa-icon: the \'x\' parameter is deprecated. Use \'size\' instead. I.e. {{fa-icon size="' + params.x + '"}}');
      classNames.push('fa-' + params.x + 'x');
    }
    if (params.size) {
      if (Ember['default'].typeOf(params.size) === 'string' && params.size.match(/\d+/)) {
        params.size = Number(params.size);
      }
      if (Ember['default'].typeOf(params.size) === 'number') {
        classNames.push('fa-' + params.size + 'x');
      } else {
        classNames.push('fa-' + params.size);
      }
    }
    if (params.fixedWidth) {
      classNames.push('fa-fw');
    }
    if (params.listItem) {
      classNames.push('fa-li');
    }
    if (params.pull) {
      classNames.push('pull-' + params.pull);
    }
    if (params.border) {
      classNames.push('fa-border');
    }
    if (params.classNames && !Ember['default'].isArray(params.classNames)) {
      params.classNames = [params.classNames];
    }
    if (!Ember['default'].isEmpty(params.classNames)) {
      Array.prototype.push.apply(classNames, params.classNames);
    }

    html += '<';
    var tagName = params.tagName || 'i';
    html += tagName;
    html += ' class=\'' + classNames.join(' ') + '\'';
    if (params.title) {
      html += ' title=\'' + params.title + '\'';
    }
    if (params.ariaHidden === undefined || params.ariaHidden) {
      html += ' aria-hidden="true"';
    }
    html += '></' + tagName + '>';
    return Ember['default'].String.htmlSafe(html);
  };

  exports['default'] = Ember['default'].Handlebars.makeBoundHelper(faIcon);

  exports.faIcon = faIcon;

});
define('dashboard/helpers/inline-svg', ['exports', 'ember', 'dashboard/svgs', 'ember-inline-svg/utils/general'], function (exports, Ember, SVGs, general) {

  'use strict';

  exports.inlineSvg = inlineSvg;

  function inlineSvg(path, options) {
    var jsonPath = general.dottify(path);
    var svg = Ember['default'].get(SVGs['default'], jsonPath);

    // TODO: Ember.get should return `null`, not `undefined`.
    // if (svg === null && /\.svg$/.test(path))
    if (typeof svg === 'undefined' && /\.svg$/.test(path)) {
      svg = Ember['default'].get(SVGs['default'], jsonPath.slice(0, -4));
    }

    Ember['default'].assert('No SVG found for ' + path, svg);

    var hash = options.hash || {};
    svg = general.applyClass(svg, hash['class']);

    return new Ember['default'].Handlebars.SafeString(svg);
  }

  exports['default'] = Ember['default'].Handlebars.makeBoundHelper(inlineSvg);

});
define('dashboard/initializers/app-version', ['exports', 'dashboard/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;
  var registered = false;

  exports['default'] = {
    name: 'App Version',
    initialize: function initialize(container, application) {
      if (!registered) {
        var appName = classify(application.toString());
        Ember['default'].libraries.register(appName, config['default'].APP.version);
        registered = true;
      }
    }
  };

});
define('dashboard/initializers/export-application-global', ['exports', 'ember', 'dashboard/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  }

  ;

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('dashboard/initializers/navbar-notification-service', ['exports'], function (exports) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    application.inject('route', 'navbarNotificationService', 'service:navbar-notification');
    application.inject('component', 'navbarNotificationService', 'service:navbar-notification');
  }

  exports['default'] = {
    name: 'navbar-notification-service',
    initialize: initialize
  };

});
define('dashboard/initializers/resize-notification-service', ['exports'], function (exports) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    application.inject('route', 'resizeNotificationService', 'service:resize-notification');
    application.inject('component', 'resizeNotificationService', 'service:resize-notification');
  }

  exports['default'] = {
    name: 'resize-notification-service',
    initialize: initialize
  };

});
define('dashboard/mixins/charts-mixin', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({

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

});
define('dashboard/router', ['exports', 'ember', 'dashboard/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {
    this.route('index', { path: '/' });
    this.route('containers', { path: '/containers' }, function () {
      this.route('providers', { path: '/providers', queryParams: ['provider_type'] });
      this.route('projects', { path: '/projects' });
    });
  });

  exports['default'] = Router;

});
define('dashboard/routes/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    setupController: function setupController(controller) {
      // `controller` is the instance of ApplicationController
      controller.set('title', 'Hello world, demo!');
    }

  });

});
define('dashboard/routes/containers/projects', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    queryParams: {
      id: 1
    },
    providerName: '',

    model: function model(params) {
      var url = window.location.protocol + '//' + window.location.hostname + ':' + 3200;
      var id = params.id;
      if (id > 0) {
        url = url + '/projects' + '/' + params.id;
      } else {
        // Default for now...
        url = url + '/projects' + '/1';
      }
      return Ember['default'].$.getJSON(url);
    },

    setupController: function setupController(controller, model) {

      this.providerName = model.provider.name;

      // FAKE NODE USAGE FOR NOW
      var numNodes = model.nodes.count;
      model.nodeCpuUsage = {
        data: this.randomizeData(numNodes)
      };
      model.nodeMemoryUsage = {
        data: this.randomizeData(numNodes)
      };
      model.nodeStorageUsage = {
        data: this.randomizeData(numNodes)
      };
      model.nodeNetworkUsage = {
        data: this.randomizeData(numNodes)
      };

      controller.set('model', model);
    },

    handleActivate: (function () {
      this.navbarNotificationService.setActiveItem('containersProjectsNavItem');
    }).on('activate'),

    randomInt: function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    nodeObjectId: 0,

    getUsedValue: function getUsedValue(total) {
      var used;

      var bucketPercent = this.randomInt(0, 100);
      if (bucketPercent < 65) {
        used = Math.floor(this.randomInt(20, total * 0.70));
      } else if (bucketPercent < 85) {
        used = Math.floor(this.randomInt(total * 0.70, total * 0.80));
      } else if (bucketPercent < 95) {
        used = Math.floor(this.randomInt(total * 0.80, total * 0.90));
      } else {
        used = Math.floor(this.randomInt(total * 0.90, total));
      }

      return used;
    },

    randomizeData: function randomizeData(count) {
      var newData = [];

      for (var i = 0; i < count; i++) {
        var total = 100;
        var used = this.getUsedValue(total);
        var available = total - used;
        var value = used / total;
        var valuePercent = Math.floor(value * 100);

        newData[i] = {
          id: this.incrementProperty('nodeObjectId'),
          value: value,
          tooltip: ['Node ' + i + ' : ' + this.providerName, valuePercent + '% : ' + used + ' Used of ' + total + ' Total', available + ' Available'].join('<br/>')
        };
      }

      newData.sort(function (a, b) {
        return b.value - a.value;
      });

      return newData;
    }
  });

});
define('dashboard/routes/containers/providers', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    queryParams: {
      provider_type: 'openshift'
    },
    providerType: '',

    model: function model(params) {
      this.providerType = params.provider_type;
      var url = window.location.protocol + '//' + window.location.hostname + ':' + 3200;
      url = url + '/' + this.providerType + 'Providers';
      return Ember['default'].$.getJSON(url);
    },

    setupController: function setupController(controller, model) {

      // FAKE NODE USAGE FOR NOW
      var numNodes = model.nodes.count;
      model.nodeCpuUsage = {
        data: this.randomizeData(numNodes)
      };
      model.nodeMemoryUsage = {
        data: this.randomizeData(numNodes)
      };
      model.nodeStorageUsage = {
        data: this.randomizeData(numNodes)
      };
      model.nodeNetworkUsage = {
        data: this.randomizeData(numNodes)
      };

      controller.set('model', model);
    },

    handleActivate: (function () {
      this.navbarNotificationService.setActiveItem('containersProvidersNavItem');
    }).on('activate'),

    randomInt: function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    nodeObjectId: 0,

    getUsedValue: function getUsedValue(total) {
      var used;

      var bucketPercent = this.randomInt(0, 100);
      if (bucketPercent < 65) {
        used = Math.floor(this.randomInt(20, total * 0.70));
      } else if (bucketPercent < 85) {
        used = Math.floor(this.randomInt(total * 0.70, total * 0.80));
      } else if (bucketPercent < 95) {
        used = Math.floor(this.randomInt(total * 0.80, total * 0.90));
      } else {
        used = Math.floor(this.randomInt(total * 0.90, total));
      }

      return used;
    },

    randomizeData: function randomizeData(count) {
      var newData = [];

      for (var i = 0; i < count; i++) {
        var total = 100;
        var used = this.getUsedValue(total);
        var available = total - used;
        var value = used / total;
        var valuePercent = Math.floor(value * 100);

        newData[i] = {
          id: this.incrementProperty('nodeObjectId'),
          value: value,
          tooltip: ['Node ' + i + ' : My ' + this.providerType + ' Provider', valuePercent + '% : ' + used + ' Used of ' + total + ' Total', available + ' Available'].join('<br/>')
        };
      }

      newData.sort(function (a, b) {
        return b.value - a.value;
      });

      return newData;
    }
  });

});
define('dashboard/routes/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({

    model: function model() {
      var url = window.location.protocol + "//" + window.location.hostname + ":" + 3200;
      url = url + "/containers";
      return Ember['default'].$.getJSON(url);
    },

    setupController: function setupController(controller, model) {

      // FAKE NODE USAGE FOR NOW
      var openShiftCount = model.nodes.openShiftCount;
      var kubernetesCount = model.nodes.kubernetesCount;
      model.nodeCpuUsage = {
        data: this.randomizeData(openShiftCount, kubernetesCount)
      };
      model.nodeMemoryUsage = {
        data: this.randomizeData(openShiftCount, kubernetesCount)
      };
      model.nodeStorageUsage = {
        data: this.randomizeData(openShiftCount, kubernetesCount)
      };
      model.nodeNetworkUsage = {
        data: this.randomizeData(openShiftCount, kubernetesCount)
      };

      controller.set("model", model);
    },

    handleActivate: (function () {
      this.navbarNotificationService.setActiveItem("containersDashboardNavItem");
    }).on("activate"),

    randomInt: function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    nodeObjectId: 0,

    getUsedValue: function getUsedValue(total) {
      var used;

      var bucketPercent = this.randomInt(0, 100);
      if (bucketPercent < 65) {
        used = Math.floor(this.randomInt(20, total * 0.70));
      } else if (bucketPercent < 85) {
        used = Math.floor(this.randomInt(total * 0.70, total * 0.80));
      } else if (bucketPercent < 95) {
        used = Math.floor(this.randomInt(total * 0.80, total * 0.90));
      } else {
        used = Math.floor(this.randomInt(total * 0.90, total));
      }

      return used;
    },

    randomizeData: function randomizeData(openShiftCount, kubernetesCount) {
      var newData = [];

      for (var i = 0; i < openShiftCount; i++) {
        var _total = 100;
        var used = this.getUsedValue(_total);
        var available = _total - used;
        var value = used / _total;
        var valuePercent = Math.floor(value * 100);

        newData.pushObject({
          id: this.incrementProperty("nodeObjectId"),
          value: value,
          tooltip: ["Node " + i + " : My OpenShift Provider", valuePercent + "% : " + used + " Used of " + _total + " Total", available + " Available"].join("<br/>")
        });
      }

      for (var k = 0; k < kubernetesCount; k++) {
        var total = 100;
        var used = this.getUsedValue(total);
        var available = total - used;
        var value = used / total;
        var valuePercent = Math.floor(value * 100);

        newData.pushObject({
          id: this.incrementProperty("nodeObjectId"),
          value: value,
          tooltip: ["Node " + k + " : My Kubernetes Provider", valuePercent + "% : " + used + " Used of " + total + " Total", available + " Available"].join("<br/>")
        });
      }

      newData.sort(function (a, b) {
        return b.value - a.value;
      });

      return newData;
    }
  });

});
define('dashboard/routes/sample-charts', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    myModel: {
      sampleChartData: {
        columns: [['data1', 30, 20, 50, 40, 60, 50], ['data2', 200, 130, 90, 240, 130, 220], ['data3', 300, 200, 160, 400, 250, 250], ['data4', 200, 130, 90, 240, 130, 220], ['data5', 130, 120, 150, 140, 160, 150], ['data6', 90, 70, 20, 50, 60, 120]],
        type: 'bar',
        types: {
          data3: 'spline',
          data4: 'line',
          data6: 'area'
        },
        groups: [['data1', 'data2']]
      },
      cpuUsage: {
        used: 950,
        total: 1000,
        data: [712, 725, 729, 710, 740, 742, 750]
      },
      nodes: {
        count: 52,
        errorCount: 3
      },
      pods: {
        count: 1200,
        errorCount: 35
      },
      containers: {
        count: 300
      },
      services: {
        count: 2500
      }
    },

    model: function model() {
      return this.myModel;
    },

    setupController: function setupController(controller, model) {
      controller.set('model', model);
    }

  });

});
define('dashboard/services/navbar-notification', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Object.extend(Ember['default'].Evented, {
    _currentNavbarSelection: 'containersDashboardNavItem',

    _initNavbarHandler: (function () {
      this._currentNavbarSelection = 'containersDashboardNavItem';
    }).on('init'),

    setActiveItem: function setActiveItem(elementId) {
      var self = this;
      Ember['default'].run.later(function () {
        var currentElement = $('#' + self._currentNavbarSelection);
        var newElement = $('#' + elementId);

        if (currentElement) {
          currentElement.removeClass('active');
        }
        if (newElement) {
          newElement.addClass('active');
        }
        self._currentNavbarSelection = elementId;
      }, 100);
    }
  });

});
define('dashboard/services/resize-notification', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Object.extend(Ember['default'].Evented, {
    _oldWindowWidth: null,
    _oldWindowHeight: null,

    _initResizeHandler: (function () {
      var self = this;
      Ember['default'].$(window).on('resize', function () {
        self._triggerResizeListenersLowLatency();
        Ember['default'].run.debounce(self, self._triggerResizeListeners, 100);
      });
    }).on('init'),

    _triggerResizeListenersLowLatency: function _triggerResizeListenersLowLatency() {
      var self = this;
      var width = window.innerWidth;
      var height = window.innerHeight;
      if (width !== self.get('_oldWindowWidth') || height !== self.get('_oldWindowHeight')) {
        self.set('_oldWindowWidth', width);
        self.set('_oldWindowHeight', height);
        self.trigger('windowResizedLowLatency');
      }
    },

    _triggerResizeListeners: function _triggerResizeListeners() {
      var self = this;
      var width = window.innerWidth;
      var height = window.innerHeight;
      if (width !== self.get('_oldWindowWidth') || height !== self.get('_oldWindowHeight')) {
        self.set('_oldWindowWidth', width);
        self.set('_oldWindowHeight', height);
        self.trigger('windowResized');
      }
    }

  });
  /* event */

});
define('dashboard/svgs', ['exports'], function (exports) {

  'use strict';

  exports['default'] = {
    "Project": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"448\" height=\"448\" viewBox=\"0 0 448 448\"><path d=\"M447 282.5c-5.5-44.5-34-77.5-72.5-77.5-24.006 0-33.5 10-33.5 10s5.796 16.98 7 36c2.5 39.5 2 145 2 145l97-.167V281.5\"/><circle cx=\"373.596\" cy=\"153.289\" r=\"40.514\"/><path d=\"M1 282.5C6.5 238 35 205 73.5 205c24.005 0 33.5 10 33.5 10s-5.796 16.98-7 36c-2.5 39.5-2 145-2 145l-97-.167V281.5\"/><circle cx=\"74.404\" cy=\"153.289\" r=\"40.513\"/><g><path d=\"M322.03 253.43v174.795H126.17V253.43\"/><path d=\"M322.03 256.69c0-61.885-43.847-112.052-97.93-112.052-54.087 0-97.93 50.167-97.93 112.05\"/><circle cx=\"224.765\" cy=\"73.854\" r=\"54.417\"/></g></svg>",
    "Registry": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"448\" height=\"448\" viewBox=\"0 0 448 448\"><path d=\"M445.13 255.84c-1.92-2.75-4.458-4.705-7.623-5.874l-87.958-31.983c-1.834-.666-3.666-1-5.495-1-.09 0-.178.004-.264.006-.086-.003-.175-.007-.26-.007-1.832 0-3.665.333-5.498 1l-87.957 31.983c-3.164 1.17-5.704 3.125-7.62 5.873-1.916 2.747-2.874 5.788-2.874 9.12v95.95c0 2.918.75 5.624 2.25 8.122 1.5 2.5 3.54 4.458 6.12 5.873L335.908 419c2.334 1.332 4.872 2 7.622 2 .087 0 .174-.007.26-.007.087 0 .173.007.265.007 2.744 0 5.286-.668 7.618-2l87.958-34.386c2.58-1.415 4.622-3.374 6.12-5.874 1.502-2.497 2.25-5.203 2.25-8.12V264.96c.002-3.33-.957-6.373-2.87-9.12zM432.01 356.81l-88.15 39.342-88.287-39.342v-15.028l88.287 37.484 88.15-37.484v15.028zm0-47.615l-88.15 39.506-88.286-39.506v-16.735l88.287 36.425 88.15-36.966v17.277zM321.57 187.845c1.502-2.5 2.252-5.205 2.252-8.12V74.06c0-3.33-.96-6.372-2.873-9.12-1.918-2.748-4.46-4.705-7.622-5.873L225.37 27.085c-1.833-.666-3.666-1-5.496-1-.088 0-.175.004-.263.006-.085-.002-.173-.006-.26-.006-1.83 0-3.665.334-5.498 1L125.895 59.07c-3.165 1.167-5.705 3.124-7.62 5.873-1.917 2.748-2.875 5.79-2.875 9.12v105.66c0 2.917.75 5.623 2.25 8.122 1.5 2.5 3.54 4.458 6.122 5.873l87.956 34.388c2.333 1.33 4.87 1.998 7.622 1.998.088 0 .174-.006.26-.006s.174.006.264.006c2.746 0 5.288-.668 7.62-1.998l87.957-34.388c2.58-1.415 4.624-3.374 6.12-5.873zm-13.74-20.958l-88.15 38.37-88.285-38.37v-15.03l88.286 36.515 88.15-36.514v15.03zm0-48.586l-88.15 39.506-88.285-39.505v-16.734l88.286 36.425 88.15-36.966V118.3zM197.926 249.038l-87.957-31.982c-1.834-.666-3.668-1-5.497-1-.088 0-.176.004-.264.007-.087-.003-.175-.007-.262-.007-1.83 0-3.665.334-5.498 1l-87.957 31.982c-3.165 1.168-5.705 3.125-7.62 5.873C.957 257.66 0 260.7 0 264.03v105.663c0 2.916.75 5.62 2.25 8.12 1.5 2.5 3.54 4.456 6.122 5.87l87.956 34.39c2.333 1.332 4.87 2 7.622 2 .088 0 .174-.007.26-.007s.175.006.265.006c2.746 0 5.288-.667 7.62-1.998l87.957-44.098c2.58-1.414 4.623-3.373 6.12-5.873 1.5-2.498 2.25-5.203 2.25-8.12v-95.952c-.002-3.33-.96-6.37-2.875-9.12-1.917-2.747-4.457-4.704-7.62-5.872zm-5.498 106.847l-88.15 39.34-88.286-38.37v-15.028l88.286 36.515 88.15-37.484v15.027zm0-47.615l-88.15 39.507-88.286-39.507v-16.733l88.286 36.424 88.15-36.965v17.275z\"/></svg>",
    "Route": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"448\" height=\"448\" viewBox=\"0 0 448 448\"><path d=\"M384.194 210.28v-.484H235.268v-42.238c33.708-1.346 31.218-5.15 31.218-5.15l14.195-24.466.12.323 14.954-23.597c-9.62-20.216-20.138-33.93-29.604-43.197 16.287 4.682 26.294 12.664 44.943 20.42l11.25-18.254C289 56 269.833 47.833 223.203 47.856c-97.172.05-176.227 79.06-176.227 176.23 0 2.927.033 3.9.065 4.096-.035.522-.09 1.425-.17 2.94l6.85-.347h160.567v42.928c-8.708 1.48-18.78 4.418-23.93 8.805l-15.867 27.167c15.496-7.88 26.798-12.17 39.798-13.925v71.982c-13.067-7.208-32.387-21.168-48.01-46.136l-11.607 19.337c14.58 19.342 29.44 31.71 41.166 39.414-23.87-2.06-37.42-9.217-54.41-20.987l-9.77 16.608c21.843 18.53 46.176 25.198 91.548 24.35 97.154-1.82 176.23-79.054 176.23-176.233 0-5.505.793-8.856.296-14.234l-15.536.43zM235.268 74.985c12.153 7.814 31.298 25.165 44.88 61.52-5.685 3.876-18.04 8.436-44.88 9.792V74.986zm-121.303 134.81H67.248c2.635-28.81 13.16-55.097 29.4-77.03 6.912 4.5 18.674 11.373 34.552 17.854-8.952 17.983-15.47 37.867-17.235 59.175zm-2.95-93.814c22.083-22.404 50.96-38.363 83.304-45.072-15.32 13.64-35.696 34.392-52.162 60.34-13.596-5.38-24.21-11.104-31.143-15.268zm103.274 93.814H136.53c2.002-18.504 7.935-35.882 15.918-51.687 17.567 5.253 38.37 9.22 61.842 9.747v41.94zm0-63.256c-18.676-.655-35.692-3.792-50.52-7.98 16.525-25.28 36.815-45.074 50.52-56.946v64.926zm20.978 84.235h82.2c-1.152 21.03-7.025 40.186-15.316 57.167-20.803-7.33-44.546-13.69-66.884-15.077v-42.09zm0 64.186c18.473.936 38.37 5.79 56.34 11.66-18.58 28.906-42.6 49.593-56.34 60.04v-71.7zm23.26 80.6c16.29-12.85 37.933-33.247 54.818-61.076 11.213 4.43 20.708 8.736 27.272 11.87-21.26 23.67-49.78 41.002-82.09 49.207zm95-65.677c-6.753-3.403-17.37-8.504-30.292-13.854 8.86-18.975 15.116-40.74 16.46-65.255h39.976c-1.25 29.448-10.705 56.41-26.143 79.108z\"/><path d=\"M323.458 146.478h57.23V191.5L449 129.46l-68.312-63v44.53h-57.23c-10.895 0-10.895 35.488 0 35.488zM63.336 304.81H8.15c-10.866 0-10.866 37.604 0 37.604h55.186v46.864l67.028-65.59-67.028-66.604v47.727z\"/></svg>",
    "kubernetes": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"744.094\" height=\"1052.362\" viewBox=\"0 0 744.09448819 1052.3622047\"><path transform=\"matrix(-.70424 -1.14722 1.15668 -.69847 -57.76 -127.5)\" d=\"M-391.43 129.505l-168.045 108.95-189.956-63.452-68.827-188.077 104.132-171.074 198.677-25.25 143.613 139.59z\" fill=\"#326de6\" stroke=\"#326de6\" stroke-width=\"69\" stroke-linejoin=\"round\"/><path transform=\"matrix(-.05312 -.23128 .23113 -.05248 268.238 562.52)\" d=\"M728 432.362c0 397.645-322.355 720-720 720s-720-322.355-720-720 322.355-720 720-720 720 322.355 720 720z\" fill=\"none\" stroke=\"#fff\" stroke-width=\"162.015\" stroke-linejoin=\"round\"/><g stroke=\"#fff\"><g fill=\"#fff\"><g stroke-width=\"1.768\"><path d=\"M751.737 103.835l68.452.157 4.293 474.38-101.295.884z\" transform=\"matrix(.27454 -.00003 .00003 .29115 145.572 312.246)\"/><path d=\"M866.655 103.835l-68.45.156-4.295 474.382 101.295.883z\" transform=\"matrix(.27454 -.00003 .00003 .29115 145.572 312.246)\"/></g><path transform=\"matrix(.28576 -.00003 .00003 .3175 136.435 322.047)\" d=\"M860.592-99.897c0 28.265-22.913 51.178-51.178 51.178-28.265 0-51.18-22.912-51.18-51.177s22.915-51.18 51.18-51.18 51.178 22.915 51.178 51.18z\" stroke-width=\"1.08\"/><path d=\"M351.076 285.188c0 1.37-.062 3.337-.016 4.657.192 5.513 1.327 9.74 2.006 14.82 1.23 10.87 2.265 19.882 1.63 28.258-.58 4.192-2.858 5.842-4.762 7.783L373 356.963l-3.462-71.653z\" stroke-width=\".335\" transform=\"matrix(1 0 0 .93884 2.035 22.346)\"/><path d=\"M380.315 285.188c0 1.37.062 3.337.016 4.657-.192 5.513-1.327 9.74-2.006 14.82-1.23 10.87-2.264 19.882-1.628 28.258.578 4.192 2.857 5.842 4.76 7.783l-23.066 16.257 3.463-71.653z\" stroke-width=\".335\" transform=\"matrix(1 0 0 .93884 2.035 22.346)\"/></g><path transform=\"matrix(.80326 -.59012 .59264 .79984 -120.55 303.588)\" d=\"M266.048 526.72l-41.11-7.78-19.552-36.992 16.732-38.35 40.415-10.83 33.665 24.847 1.564 41.812z\" fill=\"none\" stroke-width=\"38\"/><g fill=\"#fff\"><g stroke-width=\"1.768\"><path d=\"M751.737 103.835l68.452.157 4.293 474.38-101.295.884z\" transform=\"matrix(.17115 -.21466 .22765 .1815 52.576 570.897)\"/><path d=\"M866.655 103.835l-68.45.156-4.295 474.382 101.295.883z\" transform=\"matrix(.17115 -.21466 .22765 .1815 52.576 570.897)\"/></g><path transform=\"matrix(.17814 -.22343 .24825 .19793 54.54 584.152)\" d=\"M860.592-99.897c0 28.265-22.913 51.178-51.178 51.178-28.265 0-51.18-22.912-51.18-51.177s22.915-51.18 51.18-51.18 51.178 22.915 51.178 51.18z\" stroke-width=\"1.08\"/><path d=\"M351.076 285.188c0 1.37-.062 3.337-.016 4.657.192 5.513 1.327 9.74 2.006 14.82 1.23 10.87 2.265 19.882 1.63 28.258-.58 4.192-2.858 5.842-4.762 7.783L373 356.963l-3.462-71.653z\" stroke-width=\".335\" transform=\"matrix(.62348 -.78184 .73402 .58535 -263.572 502.37)\"/><path d=\"M380.315 285.188c0 1.37.062 3.337.016 4.657-.192 5.513-1.327 9.74-2.006 14.82-1.23 10.87-2.264 19.882-1.628 28.258.578 4.192 2.857 5.842 4.76 7.783l-23.066 16.257 3.463-71.653z\" stroke-width=\".335\" transform=\"matrix(.62348 -.78184 .73402 .58535 -263.572 502.37)\"/></g><g fill=\"#fff\"><g stroke-width=\"1.768\"><path d=\"M751.737 103.835l68.452.157 4.293 474.38-101.295.884z\" transform=\"matrix(-.06112 -.26765 .28384 -.06482 197.108 804.968)\"/><path d=\"M866.655 103.835l-68.45.156-4.295 474.382 101.295.883z\" transform=\"matrix(-.06112 -.26765 .28384 -.06482 197.108 804.968)\"/></g><path transform=\"matrix(-.06362 -.2786 .30953 -.0707 208.696 811.696)\" d=\"M860.592-99.897c0 28.265-22.913 51.178-51.178 51.178-28.265 0-51.18-22.912-51.18-51.177s22.915-51.18 51.18-51.18 51.178 22.915 51.178 51.18z\" stroke-width=\"1.08\"/><path d=\"M351.076 285.188c0 1.37-.062 3.337-.016 4.657.192 5.513 1.327 9.74 2.006 14.82 1.23 10.87 2.265 19.882 1.63 28.258-.58 4.192-2.858 5.842-4.762 7.783L373 356.963l-3.462-71.653z\" stroke-width=\".335\" transform=\"matrix(-.22254 -.97492 .9153 -.20892 -53.58 1009.42)\"/><path d=\"M380.315 285.188c0 1.37.062 3.337.016 4.657-.192 5.513-1.327 9.74-2.006 14.82-1.23 10.87-2.264 19.882-1.628 28.258.578 4.192 2.857 5.842 4.76 7.783l-23.066 16.257 3.463-71.653z\" stroke-width=\".335\" transform=\"matrix(-.22254 -.97492 .9153 -.20892 -53.58 1009.42)\"/></g><g fill=\"#fff\"><g stroke-width=\"1.768\"><path d=\"M751.737 103.835l68.452.157 4.293 474.38-101.295.884z\" transform=\"matrix(-.24737 -.11908 .1263 -.26233 469.968 838.074)\"/><path d=\"M866.655 103.835l-68.45.156-4.295 474.382 101.295.883z\" transform=\"matrix(-.24737 -.11908 .1263 -.26233 469.968 838.074)\"/></g><path transform=\"matrix(-.25747 -.12395 .13772 -.28607 482.453 833.21)\" d=\"M860.592-99.897c0 28.265-22.913 51.178-51.178 51.178-28.265 0-51.18-22.912-51.18-51.177s22.915-51.18 51.18-51.18 51.178 22.915 51.178 51.18z\" stroke-width=\"1.08\"/><path d=\"M351.076 285.188c0 1.37-.062 3.337-.016 4.657.192 5.513 1.327 9.74 2.006 14.82 1.23 10.87 2.265 19.882 1.63 28.258-.58 4.192-2.858 5.842-4.762 7.783L373 356.963l-3.462-71.653z\" stroke-width=\".335\" transform=\"matrix(-.90098 -.43386 .40733 -.84587 473.515 1161.544)\"/><path d=\"M380.315 285.188c0 1.37.062 3.337.016 4.657-.192 5.513-1.327 9.74-2.006 14.82-1.23 10.87-2.264 19.882-1.628 28.258.578 4.192 2.857 5.842 4.76 7.783l-23.066 16.257 3.463-71.653z\" stroke-width=\".335\" transform=\"matrix(-.90098 -.43386 .40733 -.84587 473.515 1161.544)\"/></g><g fill=\"#fff\"><g stroke-width=\"1.768\"><path d=\"M751.737 103.835l68.452.157 4.293 474.38-101.295.884z\" transform=\"matrix(-.24733 .11915 -.12636 -.2623 665.89 645.054)\"/><path d=\"M866.655 103.835l-68.45.156-4.295 474.382 101.295.883z\" transform=\"matrix(-.24733 .11915 -.12636 -.2623 665.89 645.054)\"/></g><path transform=\"matrix(-.25744 .12402 -.1378 -.28604 669.87 632.26)\" d=\"M860.592-99.897c0 28.265-22.913 51.178-51.178 51.178-28.265 0-51.18-22.912-51.18-51.177s22.915-51.18 51.18-51.18 51.178 22.915 51.178 51.18z\" stroke-width=\"1.08\"/><path d=\"M351.076 285.188c0 1.37-.062 3.337-.016 4.657.192 5.513 1.327 9.74 2.006 14.82 1.23 10.87 2.265 19.882 1.63 28.258-.58 4.192-2.858 5.842-4.762 7.783L373 356.963l-3.462-71.653z\" stroke-width=\".335\" transform=\"matrix(-.90096 .4339 -.40737 -.84585 921.003 843.96)\"/><path d=\"M380.315 285.188c0 1.37.062 3.337.016 4.657-.192 5.513-1.327 9.74-2.006 14.82-1.23 10.87-2.264 19.882-1.628 28.258.578 4.192 2.857 5.842 4.76 7.783l-23.066 16.257 3.463-71.653z\" stroke-width=\".335\" transform=\"matrix(-.90096 .4339 -.40737 -.84585 921.003 843.96)\"/></g><g fill=\"#fff\"><g stroke-width=\"1.768\"><path d=\"M751.737 103.835l68.452.157 4.293 474.38-101.295.884z\" transform=\"matrix(-.06105 .26766 -.28386 -.06475 637.225 371.453)\"/><path d=\"M866.655 103.835l-68.45.156-4.295 474.382 101.295.883z\" transform=\"matrix(-.06105 .26766 -.28386 -.06475 637.225 371.453)\"/></g><path transform=\"matrix(-.06355 .2786 -.30955 -.0706 629.704 360.364)\" d=\"M860.592-99.897c0 28.265-22.913 51.178-51.178 51.178-28.265 0-51.18-22.912-51.18-51.177s22.915-51.18 51.18-51.18 51.178 22.915 51.178 51.18z\" stroke-width=\"1.08\"/><path d=\"M351.076 285.188c0 1.37-.062 3.337-.016 4.657.192 5.513 1.327 9.74 2.006 14.82 1.23 10.87 2.265 19.882 1.63 28.258-.58 4.192-2.858 5.842-4.762 7.783L373 356.963l-3.462-71.653z\" stroke-width=\".335\" transform=\"matrix(-.22248 .97494 -.9153 -.20888 951.795 296.01)\"/><path d=\"M380.315 285.188c0 1.37.062 3.337.016 4.657-.192 5.513-1.327 9.74-2.006 14.82-1.23 10.87-2.264 19.882-1.628 28.258.578 4.192 2.857 5.842 4.76 7.783l-23.066 16.257 3.463-71.653z\" stroke-width=\".335\" transform=\"matrix(-.22248 .97494 -.9153 -.20888 951.795 296.01)\"/></g><g fill=\"#fff\"><g stroke-width=\"1.768\"><path d=\"M751.737 103.835l68.452.157 4.293 474.38-101.295.884z\" transform=\"matrix(.1712 .21462 -.2276 .18156 405.748 223.24)\"/><path d=\"M866.655 103.835l-68.45.156-4.295 474.382 101.295.883z\" transform=\"matrix(.1712 .21462 -.2276 .18156 405.748 223.24)\"/></g><path transform=\"matrix(.1782 .2234 -.2482 .198 392.388 222.208)\" d=\"M860.592-99.897c0 28.265-22.913 51.178-51.178 51.178-28.265 0-51.18-22.912-51.18-51.177s22.915-51.18 51.18-51.18 51.178 22.915 51.178 51.18z\" stroke-width=\"1.08\"/><path d=\"M351.076 285.188c0 1.37-.062 3.337-.016 4.657.192 5.513 1.327 9.74 2.006 14.82 1.23 10.87 2.265 19.882 1.63 28.258-.58 4.192-2.858 5.842-4.762 7.783L373 356.963l-3.462-71.653z\" stroke-width=\".335\" transform=\"matrix(.62352 .7818 -.734 .5854 542.894 -69.737)\"/><path d=\"M380.315 285.188c0 1.37.062 3.337.016 4.657-.192 5.513-1.327 9.74-2.006 14.82-1.23 10.87-2.264 19.882-1.628 28.258.578 4.192 2.857 5.842 4.76 7.783l-23.066 16.257 3.463-71.653z\" stroke-width=\".335\" transform=\"matrix(.62352 .7818 -.734 .5854 542.894 -69.737)\"/></g></g><g fill=\"#fff\"><path d=\"M344.765 464.364c-.292 6.863-5.94 12.344-12.875 12.344-2.84 0-5.463-.913-7.594-2.47l-3.344 1.595 6.844 14.156 30-14.47-6.813-14.156-6.218 3zM295.8 510.062c5.185 4.507 5.948 12.34 1.624 17.763-1.77 2.22-4.12 3.702-6.665 4.398l-.84 3.607 15.335 3.476 7.393-32.476-15.316-3.5-1.53 6.732zM300.945 576.804c6.756-1.243 13.356 3.044 14.9 9.806.632 2.77.326 5.53-.718 7.952l2.298 2.906 12.28-9.823-20.783-26.028-12.286 9.792 4.31 5.394zM356.335 614.37c3.24-6.056 10.707-8.543 16.956-5.534 2.56 1.232 4.527 3.192 5.772 5.52l3.704.013-.025-15.724-33.305.02-.004 15.71 6.905-.005zM420.183 594.268c-2.715-6.31-.004-13.7 6.244-16.708 2.56-1.233 5.318-1.548 7.913-1.07l2.32-2.888-12.307-9.784-20.75 26.053 12.28 9.8 4.3-5.402zM444.564 531.844c-6.626-1.81-10.712-8.538-9.17-15.3.632-2.768 2.105-5.122 4.097-6.853l-.81-3.613-15.323 3.522 7.43 32.466 15.318-3.492-1.54-6.73zM410.958 473.965c-5.548 4.052-13.355 3.053-17.68-2.37-1.77-2.22-2.692-4.84-2.804-7.475l-3.33-1.62-6.8 14.177 30.017 14.432 6.82-14.153-6.222-2.99z\"/></g></svg>",
    "openshift": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32.001\" height=\"29.39\" viewBox=\"-224 306.61 32.001 29.39\"><path fill=\"#C32034\" d=\"M-214.707 319.79l-5.138 1.87c.065.823.207 1.636.407 2.434l4.88-1.778c-.157-.823-.215-1.675-.15-2.527M-192 314.108c-.358-.74-.77-1.454-1.25-2.128l-5.14 1.87c.6.612 1.1 1.3 1.51 2.034l4.88-1.776z\"/><path fill=\"#DB212F\" d=\"M-203.304 312.652c1.07.5 1.995 1.18 2.775 1.978l5.138-1.87c-1.422-1.996-3.36-3.665-5.736-4.774-7.344-3.424-16.105-.235-19.53 7.108-1.107 2.376-1.52 4.9-1.326 7.343l5.137-1.87c.085-1.113.358-2.228.855-3.298 2.227-4.77 7.918-6.84 12.688-4.618\"/><path fill=\"#EA2227\" d=\"M-219.12 323.977l-4.88 1.778c.448 1.78 1.224 3.47 2.294 4.975l5.126-1.866c-1.315-1.35-2.19-3.06-2.54-4.887\"/><path fill=\"#DB212F\" d=\"M-197.824 322.04c-.08 1.112-.362 2.23-.86 3.3-2.226 4.77-7.917 6.84-12.69 4.616-1.07-.5-2-1.174-2.78-1.974l-5.126 1.867c1.42 1.995 3.355 3.664 5.73 4.774 7.344 3.423 16.105.235 19.53-7.11 1.107-2.375 1.516-4.9 1.32-7.342l-5.124 1.868z\"/><path fill=\"#EA2227\" d=\"M-196.56 315.768l-4.884 1.776c.906 1.625 1.335 3.495 1.195 5.378l5.127-1.865c-.146-1.84-.635-3.637-1.438-5.29\"/><path fill=\"#AD213A\" d=\"M-219.846 321.66l5.125-1.85-.02 1.015-4.946 1.837-.16-1.002zM-198.39 313.837l5.205-1.76.54.805-5.056 1.76-.69-.805z\"/><path fill=\"#BA2034\" d=\"M-219.282 329.832l5.132-1.837 1.552 1.442-5.38 1.99-1.304-1.595zM-192.612 320.19l-5.212 1.85-.384 2.054 5.557-1.95.038-1.954z\"/></svg>",
    "replicator": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"448\" height=\"448\" viewBox=\"0 0 448 448\"><g fill=\"none\" stroke=\"#449FDB\"><path opacity=\".3\" d=\"M16 0v448\"/><path d=\"M32 0v448\"/><path opacity=\".3\" d=\"M48 0v448\"/><path d=\"M64 0v448\"/><path opacity=\".3\" d=\"M80 0v448\"/><path d=\"M96 0v448\"/><path opacity=\".3\" d=\"M112 0v448\"/><path d=\"M128 0v448\"/><path opacity=\".3\" d=\"M144 0v448\"/><path d=\"M160 0v448\"/><path opacity=\".3\" d=\"M176 0v448\"/><path d=\"M192 0v448\"/><path opacity=\".3\" d=\"M208 0v448\"/><path d=\"M224 0v448\"/><path opacity=\".3\" d=\"M240 0v448\"/><path d=\"M256 0v448\"/><path opacity=\".3\" d=\"M272 0v448\"/><path d=\"M288 0v448\"/><path opacity=\".3\" d=\"M304 0v448\"/><path d=\"M320 0v448\"/><path opacity=\".3\" d=\"M336 0v448\"/><path d=\"M352 0v448\"/><path opacity=\".3\" d=\"M368 0v448\"/><path d=\"M384 0v448\"/><path opacity=\".3\" d=\"M400 0v448\"/><path d=\"M416 0v448\"/><path opacity=\".3\" d=\"M432 0v448M0 16h448\"/><path d=\"M0 32h448\"/><path opacity=\".3\" d=\"M0 48h448\"/><path d=\"M0 64h448\"/><path opacity=\".3\" d=\"M0 80h448\"/><path d=\"M0 96h448\"/><path opacity=\".3\" d=\"M0 112h448\"/><path d=\"M0 128h448\"/><path opacity=\".3\" d=\"M0 144h448\"/><path d=\"M0 160h448\"/><path opacity=\".3\" d=\"M0 176h448\"/><path d=\"M0 192h448\"/><path opacity=\".3\" d=\"M0 208h448\"/><path d=\"M0 224h448\"/><path opacity=\".3\" d=\"M0 240h448\"/><path d=\"M0 256h448\"/><path opacity=\".3\" d=\"M0 272h448\"/><path d=\"M0 288h448\"/><path opacity=\".3\" d=\"M0 304h448\"/><path d=\"M0 320h448\"/><path opacity=\".3\" d=\"M0 336h448\"/><path d=\"M0 352h448\"/><path opacity=\".3\" d=\"M0 368h448\"/><path d=\"M0 384h448\"/><path opacity=\".3\" d=\"M0 400h448\"/><path d=\"M0 416h448\"/><path opacity=\".3\" d=\"M0 432h448\"/></g><path d=\"M.69 341.73v-69.103c0-4.21 1.196-8.085 3.59-11.63 2.395-3.544 5.54-6.2 9.44-7.973l72.504-30.9v-66.443c0-4.207 1.195-8.083 3.59-11.627 2.395-3.545 5.54-6.202 9.44-7.975l74.843-31.894c2.56-1.104 5.346-1.66 8.353-1.66 3.006 0 5.79.555 8.353 1.66l74.844 31.894c3.898 1.772 7.042 4.43 9.438 7.975 2.396 3.544 3.593 7.42 3.593 11.628v66.445l72.504 30.9c4.01 1.77 7.183 4.428 9.523 7.973 2.337 3.544 3.507 7.42 3.507 11.63v69.1c0 3.988-1.058 7.7-3.174 11.135-2.118 3.432-5.012 6.033-8.688 7.806l-74.843 37.207c-2.785 1.55-5.96 2.325-9.522 2.325-3.566 0-6.74-.775-9.52-2.325L183.62 360.67c-.56-.225-.95-.444-1.17-.665-.225.22-.614.44-1.17.664l-74.843 37.207c-2.786 1.55-5.96 2.325-9.522 2.325-3.566 0-6.74-.775-9.523-2.325L12.55 360.67c-3.675-1.773-6.573-4.375-8.687-7.807C1.747 349.43.69 345.72.69 341.73zm28.734-72.258l67.492 28.737 67.492-28.738-67.492-28.74-67.492 28.74zm78.184 104.154l64.15-31.896v-52.16l-64.15 27.243v56.813zm1.17-218.443l73.672 31.396 73.674-31.397-73.674-31.396-73.673 31.396zm84.365 94.355l64.15-27.41V177.94l-64.15 27.243v44.353zm7.35 19.934l67.492 28.737 67.49-28.738-67.49-28.74-67.49 28.74zm78.184 104.154l64.15-31.896v-52.16l-64.15 27.243v56.813z\"/><path d=\"M444.16 214.94c-2.27-3.44-5.353-6.02-9.243-7.742L364.523 177.2v-64.51c0-4.086-1.163-7.85-3.485-11.29-2.33-3.44-5.382-6.02-9.168-7.742l-72.663-30.964c-2.486-1.072-5.188-1.613-8.108-1.613s-5.624.543-8.11 1.614l-45.59 19.68c2.506-1.08 5.228-1.623 8.167-1.623 2.94 0 5.663.546 8.167 1.625l77.19 33.048c3.807 1.733 6.885 4.332 9.228 7.797 2.34 3.464 3.512 7.255 3.512 11.37v9.29h.002v43.2h-.002v12.474l70.888 30.21c3.922 1.732 7.024 4.33 9.31 7.796 2.285 3.464 3.43 7.253 3.43 11.37v67.562c0 3.896-1.035 7.528-3.103 10.882-.45.728-.94 1.405-1.456 2.057l33.317-17.72c3.57-1.72 6.38-4.247 8.438-7.58 2.05-3.33 3.08-6.937 3.08-10.808V226.23c0-4.084-1.138-7.847-3.41-11.29z\"/></svg>"
  };

});
define('dashboard/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("a");
          dom.setAttribute(el1,"href","#");
          var el2 = dom.createTextNode("Dashboard");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("a");
          dom.setAttribute(el1,"href","#");
          var el2 = dom.createTextNode("Container Providers");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("a");
          dom.setAttribute(el1,"href","#");
          var el2 = dom.createTextNode("Projects");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("nav");
        dom.setAttribute(el1,"id","appNavBar");
        dom.setAttribute(el1,"class","navbar navbar-default navbar-fixed-top navbar-pf");
        dom.setAttribute(el1,"role","navigation");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","navbar-header");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("button");
        dom.setAttribute(el3,"type","button");
        dom.setAttribute(el3,"class","navbar-toggle");
        dom.setAttribute(el3,"data-toggle","collapse");
        dom.setAttribute(el3,"data-target",".navbar-collapse-1");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","sr-only");
        var el5 = dom.createTextNode("Toggle navigation");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","icon-bar");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","icon-bar");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","icon-bar");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3,"class","navbar-brand");
        dom.setAttribute(el3,"href","/");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("img");
        dom.setAttribute(el4,"src","assets/images/cfme_logo.svg");
        dom.setAttribute(el4,"alt","RED HAT Cloud Forms Management Engine");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","collapse navbar-collapse navbar-collapse-1");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        dom.setAttribute(el3,"class","nav navbar-nav navbar-utility");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        dom.setAttribute(el4,"class","dropdown");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        dom.setAttribute(el5,"class","dropdown-toggle");
        dom.setAttribute(el5,"data-toggle","dropdown");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","pficon pficon-user");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    Brian Johnson ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("b");
        dom.setAttribute(el6,"class","caret");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        dom.setAttribute(el5,"class","dropdown-menu");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("a");
        dom.setAttribute(el7,"href","#");
        var el8 = dom.createTextNode("Link");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("a");
        dom.setAttribute(el7,"href","#");
        var el8 = dom.createTextNode("Another link");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("a");
        dom.setAttribute(el7,"href","#");
        var el8 = dom.createTextNode("Something else here");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        dom.setAttribute(el6,"class","divider");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        dom.setAttribute(el6,"class","dropdown-submenu");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("a");
        dom.setAttribute(el7,"tabindex","-1");
        dom.setAttribute(el7,"href","#");
        var el8 = dom.createTextNode("More options");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("ul");
        dom.setAttribute(el7,"class","dropdown-menu");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("li");
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("a");
        dom.setAttribute(el9,"href","#");
        var el10 = dom.createTextNode("Link");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("li");
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("a");
        dom.setAttribute(el9,"href","#");
        var el10 = dom.createTextNode("Another link");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("li");
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("a");
        dom.setAttribute(el9,"href","#");
        var el10 = dom.createTextNode("Something else here");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("li");
        dom.setAttribute(el8,"class","divider");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("li");
        dom.setAttribute(el8,"class","dropdown-header");
        var el9 = dom.createTextNode("Nav header");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("li");
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("a");
        dom.setAttribute(el9,"href","#");
        var el10 = dom.createTextNode("Separated link");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("li");
        dom.setAttribute(el8,"class","divider");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("li");
        var el9 = dom.createTextNode("\n                                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("a");
        dom.setAttribute(el9,"href","#");
        var el10 = dom.createTextNode("One more separated link");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        dom.setAttribute(el6,"class","divider");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("a");
        dom.setAttribute(el7,"href","#");
        var el8 = dom.createTextNode("One more separated link");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        dom.setAttribute(el3,"class","nav navbar-nav navbar-primary persistent-secondary");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        var el6 = dom.createTextNode("Cloud Intelligence");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        var el6 = dom.createTextNode("Services");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        var el6 = dom.createTextNode("Clouds");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        var el6 = dom.createTextNode("Infrastructure");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        dom.setAttribute(el4,"class","active");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        var el6 = dom.createTextNode("Containers");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        dom.setAttribute(el5,"class","nav navbar-nav navbar-persistent");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        dom.setAttribute(el6,"id","containersDashboardNavItem");
        dom.setAttribute(el6,"class","active");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        dom.setAttribute(el6,"id","containersProvidersNavItem");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        dom.setAttribute(el6,"id","containersProjectsNavItem");
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("a");
        dom.setAttribute(el7,"href","#");
        var el8 = dom.createTextNode("Nodes");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("a");
        dom.setAttribute(el7,"href","#");
        var el8 = dom.createTextNode("Container Groups");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("a");
        dom.setAttribute(el7,"href","#");
        var el8 = dom.createTextNode("Routes");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("a");
        dom.setAttribute(el7,"href","#");
        var el8 = dom.createTextNode("Replicators");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("a");
        dom.setAttribute(el7,"href","#");
        var el8 = dom.createTextNode("Images");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("a");
        dom.setAttribute(el7,"href","#");
        var el8 = dom.createTextNode("Image Registries");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("a");
        dom.setAttribute(el7,"href","#");
        var el8 = dom.createTextNode("Services");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("a");
        dom.setAttribute(el7,"href","#");
        var el8 = dom.createTextNode("Containers");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("a");
        dom.setAttribute(el7,"href","#");
        var el8 = dom.createTextNode("Topology");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        var el6 = dom.createTextNode("Control");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        var el6 = dom.createTextNode("Automate");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        var el6 = dom.createTextNode("Optimize");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        var el6 = dom.createTextNode("Configure");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","main");
        dom.setAttribute(el1,"class","container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, block = hooks.block, subexpr = hooks.subexpr, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0, 3, 3, 9, 3]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
        var morph2 = dom.createMorphAt(dom.childAt(element0, [5]),1,1);
        var morph3 = dom.createMorphAt(dom.childAt(fragment, [2]),1,1);
        block(env, morph0, context, "link-to", ["index"], {}, child0, null);
        block(env, morph1, context, "link-to", ["containers.providers", subexpr(env, context, "query-params", [], {"provider_type": "openshift"})], {}, child1, null);
        block(env, morph2, context, "link-to", ["containers.projects"], {}, child2, null);
        content(env, morph3, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('dashboard/templates/components/aggregate-status-chart', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("i");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, concat = hooks.concat, attribute = hooks.attribute;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element1 = dom.childAt(fragment, [1]);
          var attrMorph0 = dom.createAttrMorph(element1, 'class');
          attribute(env, attrMorph0, element1, "class", concat(env, ["fa-status-icon ", get(env, context, "okStatusIconClass")]));
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("i");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n              ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1,"class","tile-pf-aggregate-status-notifications count");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, concat = hooks.concat, attribute = hooks.attribute, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var attrMorph0 = dom.createAttrMorph(element0, 'class');
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [3]),0,0);
          attribute(env, attrMorph0, element0, "class", concat(env, ["fa-status-icon ", get(env, context, "errorStatusIconClass")]));
          content(env, morph0, context, "errorCount");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","tile-pf tile-pf-accented tile-pf-aggregate-status");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","tile-pf-title status-container flex-horizontal-container");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","flex-one");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","flex-vertical-container");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","tile-pf-aggregate-status-count");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","tile-pf-aggregate-status-type");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","flex-one");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","tile-pf-aggregate-status-notifications flex-horizontal-container");
        dom.setAttribute(el3,"style","width: 54px;");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, concat = hooks.concat, attribute = hooks.attribute, content = hooks.content, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element2 = dom.childAt(fragment, [0, 1]);
        var element3 = dom.childAt(element2, [1]);
        var element4 = dom.childAt(element2, [5]);
        var attrMorph0 = dom.createAttrMorph(element3, 'class');
        var morph0 = dom.createMorphAt(dom.childAt(element4, [1]),0,0);
        var morph1 = dom.createMorphAt(dom.childAt(element4, [3]),0,0);
        var morph2 = dom.createMorphAt(dom.childAt(element2, [9]),1,1);
        attribute(env, attrMorph0, element3, "class", concat(env, ["fa pficon ", get(env, context, "aggregateTypeIconClass"), " container-font-color"]));
        content(env, morph0, context, "aggregateCount");
        content(env, morph1, context, "aggregateType");
        block(env, morph2, context, "if", [get(env, context, "allGood")], {}, child0, child1);
        return fragment;
      }
    };
  }()));

});
define('dashboard/templates/components/bread-crumb-bar', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.12.0",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("                    ");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, content = hooks.content;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
              content(env, morph0, context, "crumb.title");
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("li");
            dom.setAttribute(el1,"class","active");
            var el2 = dom.createTextNode("\n");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("                ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
            block(env, morph0, context, "link-to", [get(env, context, "crumb.route")], {}, child0, null);
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("li");
            var el2 = dom.createTextNode("\n                  ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n                ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
            content(env, morph0, context, "crumb.title");
            return fragment;
          }
        };
      }());
      var child2 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("span");
            var el2 = dom.createTextNode(":");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n                ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("i");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n                ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, concat = hooks.concat, attribute = hooks.attribute, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element0 = dom.childAt(fragment, [3]);
            var attrMorph0 = dom.createAttrMorph(element0, 'class');
            var morph0 = dom.createMorphAt(fragment,5,5,contextualElement);
            attribute(env, attrMorph0, element0, "class", concat(env, [get(env, context, "crumb.suffixIconClass")]));
            content(env, morph0, context, "crumb.suffix");
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
          var morph1 = dom.createMorphAt(fragment,1,1,contextualElement);
          dom.insertBoundary(fragment, null);
          dom.insertBoundary(fragment, 0);
          block(env, morph0, context, "if", [get(env, context, "crumb.isActive")], {}, child0, child1);
          block(env, morph1, context, "if", [get(env, context, "crumb.suffix")], {}, child2, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","navbar-fixed-top breadcrumb-bar");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ol");
        dom.setAttribute(el2,"class","breadcrumb");
        dom.setAttribute(el2,"style","margin-bottom: 0px;");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, attribute = hooks.attribute, concat = hooks.concat, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element1 = dom.childAt(fragment, [0]);
        var attrMorph0 = dom.createAttrMorph(element1, 'id');
        var attrMorph1 = dom.createAttrMorph(element1, 'style');
        var morph0 = dom.createMorphAt(dom.childAt(element1, [1]),1,1);
        attribute(env, attrMorph0, element1, "id", get(env, context, "breadCrumbBarId"));
        attribute(env, attrMorph1, element1, "style", concat(env, ["top:", get(env, context, "topPosition"), "px;"]));
        block(env, morph0, context, "each", [get(env, context, "breadCrumbs")], {"keyword": "crumb"}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('dashboard/templates/components/container-group-creation-trends', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","tile-pf");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","tile-pf-heading");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h2");
        dom.setAttribute(el3,"class","tile-pf-title");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.setAttribute(el2,"class","tile-pf-subtitle");
        var el3 = dom.createTextNode("Last 30 Days");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"id","sparklineChart");
        dom.setAttribute(el2,"class","tile-pf-body");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [1, 1]),0,0);
        var morph1 = dom.createMorphAt(dom.childAt(element0, [5]),1,1);
        content(env, morph0, context, "title");
        inline(env, morph1, context, "c3-chart", [], {"data": get(env, context, "chart_data"), "size": get(env, context, "chart_size"), "axis": get(env, context, "chart_axis"), "legend": get(env, context, "chart_legend"), "color": get(env, context, "chart_color"), "point": get(env, context, "chart_point"), "tooltip": get(env, context, "chart_tooltip")});
        return fragment;
      }
    };
  }()));

});
define('dashboard/templates/components/heat-map-legend', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","flex-horizontal-container");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","color-box");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","legend-text");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, concat = hooks.concat, attribute = hooks.attribute, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [1]);
          var attrMorph0 = dom.createAttrMorph(element1, 'style');
          var morph0 = dom.createMorphAt(dom.childAt(element0, [3]),0,0);
          attribute(env, attrMorph0, element1, "style", concat(env, ["background-color: ", get(env, context, "item.color"), ";"]));
          content(env, morph0, context, "item.text");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","heatmap-legend flex-horizontal-container");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
        block(env, morph0, context, "each", [get(env, context, "_legendItems")], {"keyword": "item"}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('dashboard/templates/components/image-creation-trends', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","tile-pf");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","tile-pf-heading");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h2");
        dom.setAttribute(el3,"class","tile-pf-title");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.setAttribute(el2,"class","tile-pf-subtitle");
        var el3 = dom.createTextNode("Last 30 Days");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"id","sparklineChart");
        dom.setAttribute(el2,"class","tile-pf-body");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [1, 1]),0,0);
        var morph1 = dom.createMorphAt(dom.childAt(element0, [5]),1,1);
        content(env, morph0, context, "title");
        inline(env, morph1, context, "c3-chart", [], {"data": get(env, context, "chart_data"), "size": get(env, context, "chart_size"), "axis": get(env, context, "chart_axis"), "legend": get(env, context, "chart_legend"), "color": get(env, context, "chart_color"), "point": get(env, context, "chart_point"), "tooltip": get(env, context, "chart_tooltip")});
        return fragment;
      }
    };
  }()));

});
define('dashboard/templates/components/object-status-chart', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("span");
            dom.setAttribute(el1,"class","tile-pf-status-count");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("span");
            dom.setAttribute(el1,"class","tile-pf-status-type");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
            var morph1 = dom.createMorphAt(dom.childAt(fragment, [3]),0,0);
            content(env, morph0, context, "objectCount");
            content(env, morph1, context, "objectType");
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, subexpr = hooks.subexpr, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, null);
          dom.insertBoundary(fragment, 0);
          block(env, morph0, context, "link-to", [get(env, context, "linkRoute"), subexpr(env, context, "query-params", [], {"id": get(env, context, "objectId")})], {}, child0, null);
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1,"class","tile-pf-status-count");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1,"class","tile-pf-status-type");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          var morph1 = dom.createMorphAt(dom.childAt(fragment, [3]),0,0);
          content(env, morph0, context, "objectCount");
          content(env, morph1, context, "objectType");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","tile-pf tile-pf-accented tile-pf-status");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h2");
        dom.setAttribute(el2,"class","tile-pf-title");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, concat = hooks.concat, attribute = hooks.attribute, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0, 1]);
        var element1 = dom.childAt(element0, [1]);
        var attrMorph0 = dom.createAttrMorph(element1, 'class');
        var morph0 = dom.createMorphAt(element0,3,3);
        attribute(env, attrMorph0, element1, "class", concat(env, ["fa pficon ", get(env, context, "typeIconClass"), " container-font-color"]));
        block(env, morph0, context, "if", [get(env, context, "hasRoute")], {}, child0, child1);
        return fragment;
      }
    };
  }()));

});
define('dashboard/templates/components/provider-type-tile', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1,"class","tile-pf-single-type");
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","fa pficon-openshift");
          dom.setAttribute(el2,"style","color:#ff0000;");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
          content(env, morph0, context, "openShiftCount");
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1,"class","tile-pf-single-type");
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","fa pficon-kubernetes");
          dom.setAttribute(el2,"style","color:#0000ff;");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
          content(env, morph0, context, "kubernetesCount");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","tile-pf tile-pf-accented tile-pf-type flex-vertical-container");
        dom.setAttribute(el1,"style","height:136px;");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","flex-one");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","flex-horizontal-container");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","flex-one");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","flex-one");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","flex-one");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0, 3]),3,3);
        block(env, morph0, context, "if", [get(env, context, "isOpenShift")], {}, child0, child1);
        return fragment;
      }
    };
  }()));

});
define('dashboard/templates/components/providers-status-chart', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          var el2 = dom.createTextNode("\n                  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","tile-pf-aggregate-status-notification count");
          var el3 = dom.createElement("span");
          dom.setAttribute(el3,"class","fa pficon-openshift");
          dom.setAttribute(el3,"style","color:#ff0000;");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n              ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, attribute = hooks.attribute, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element1 = dom.childAt(fragment, [1]);
          var attrMorph0 = dom.createAttrMorph(element1, 'title');
          var morph0 = dom.createMorphAt(dom.childAt(element1, [1]),1,1);
          attribute(env, attrMorph0, element1, "title", get(env, context, "openshiftTooltip"));
          content(env, morph0, context, "openShiftCount");
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          var el2 = dom.createTextNode("\n                  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","tile-pf-aggregate-status-notification count");
          var el3 = dom.createElement("span");
          dom.setAttribute(el3,"class","fa pficon-kubernetes");
          dom.setAttribute(el3,"style","color:#0000ff;");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n              ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, attribute = hooks.attribute, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var attrMorph0 = dom.createAttrMorph(element0, 'title');
          var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),1,1);
          attribute(env, attrMorph0, element0, "title", get(env, context, "kubernetesTooltip"));
          content(env, morph0, context, "kubernetesCount");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","providers-status tile-pf tile-pf-accented tile-pf-aggregate-status");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h2");
        dom.setAttribute(el2,"class","tile-pf-title flex-horizontal-container");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","flex-one");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","tile-pf-aggregate-text flex-vertical-container");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","tile-pf-status-count flex-one");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","tile-pf-status-type flex-one");
        var el5 = dom.createTextNode("Providers");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","flex-one");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","tile-pf-body");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","tile-pf-aggregate-status-notifications flex-horizontal-container");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","flex-one");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","aggregate-status-separator");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","flex-one");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, subexpr = hooks.subexpr, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element2 = dom.childAt(fragment, [0]);
        var element3 = dom.childAt(element2, [3, 1]);
        var morph0 = dom.createMorphAt(dom.childAt(element2, [1, 3, 1]),0,0);
        var morph1 = dom.createMorphAt(element3,3,3);
        var morph2 = dom.createMorphAt(element3,7,7);
        content(env, morph0, context, "numProviders");
        block(env, morph1, context, "link-to", ["containers.providers", subexpr(env, context, "query-params", [], {"provider_type": "openshift"})], {}, child0, null);
        block(env, morph2, context, "link-to", ["containers.providers", subexpr(env, context, "query-params", [], {"provider_type": "kubernetes"})], {}, child1, null);
        return fragment;
      }
    };
  }()));

});
define('dashboard/templates/components/quota-chart', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","quota-chart");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","flex-vertical-container");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","quota-chart-title flex-horizontal-container");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","flex-one");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode(" of ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","quota-chart-bar flex-horizontal-container");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","quota-chart-used");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","quota-chart-unused flex-one");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, concat = hooks.concat, attribute = hooks.attribute;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0, 1]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element1, [5]);
        var element3 = dom.childAt(element0, [3, 1]);
        var morph0 = dom.createMorphAt(dom.childAt(element1, [1]),0,0);
        var morph1 = dom.createMorphAt(element2,0,0);
        var morph2 = dom.createMorphAt(element2,2,2);
        var attrMorph0 = dom.createAttrMorph(element3, 'style');
        content(env, morph0, context, "title");
        content(env, morph1, context, "usedUnits");
        content(env, morph2, context, "totalUnits");
        attribute(env, attrMorph0, element3, "style", concat(env, ["width:", get(env, context, "usedPercent"), "%"]));
        return fragment;
      }
    };
  }()));

});
define('dashboard/templates/components/utilization-chart', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","utilization-chart");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h3");
        dom.setAttribute(el2,"class","h4 count-title");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","count-utilization flex-horizontal-container");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","available-text flex-vertical-container");
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","title-small title-small-upper");
        var el5 = dom.createTextNode("Available");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","title-small title-small-lower");
        var el5 = dom.createTextNode(" of ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode(" ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"id","radial-chart-containter");
        dom.setAttribute(el2,"class","radial-chart flex-horizontal-container");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","flex-one");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","flex-one");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"id","sparklineChart");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        dom.setAttribute(el2,"class","pull-left legend-text");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [3]);
        var element2 = dom.childAt(element1, [1]);
        var element3 = dom.childAt(element1, [3, 3]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),0,0);
        var morph1 = dom.createMorphAt(element2,0,0);
        var morph2 = dom.createMorphAt(element2,2,2);
        var morph3 = dom.createMorphAt(element3,1,1);
        var morph4 = dom.createMorphAt(element3,3,3);
        var morph5 = dom.createMorphAt(dom.childAt(element0, [5]),3,3);
        var morph6 = dom.createMorphAt(dom.childAt(element0, [7]),1,1);
        var morph7 = dom.createMorphAt(dom.childAt(element0, [9]),0,0);
        content(env, morph0, context, "title");
        content(env, morph1, context, "available");
        content(env, morph2, context, "availableUnits");
        content(env, morph3, context, "total");
        content(env, morph4, context, "totalUnits");
        inline(env, morph5, context, "c3-chart", [], {"data": get(env, context, "radial_data"), "config": get(env, context, "radial_config"), "donut": get(env, context, "radial_donut"), "size": get(env, context, "radial_size"), "legend": get(env, context, "radial_legend"), "color": get(env, context, "radial_color"), "tooltip": get(env, context, "radial_tooltip")});
        inline(env, morph6, context, "c3-chart", [], {"data": get(env, context, "sparkline_data"), "config": get(env, context, "sparkline_config"), "area": get(env, context, "sparkline_settings"), "size": get(env, context, "sparkline_size"), "axis": get(env, context, "sparkline_axis"), "point": get(env, context, "sparkline_point"), "legend": get(env, context, "sparkline_legend"), "color": get(env, context, "sparkline_color"), "tooltip": get(env, context, "sparkline_tooltip")});
        content(env, morph7, context, "legendLeftText");
        return fragment;
      }
    };
  }()));

});
define('dashboard/templates/containers/projects', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","project-dashboard container-fluid container-tiles-pf");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row row-tile-pf");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-xs-7 col-sm-8 col-md-8");
        var el4 = dom.createTextNode("\n                ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","row");
        var el5 = dom.createTextNode("\n                    ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","col-xs-6 col-sm-3 col-md-4");
        var el6 = dom.createTextNode("\n                      ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                    ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","col-xs-6 col-sm-3 col-md-4");
        var el6 = dom.createTextNode("\n                      ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                    ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","col-xs-6 col-sm-3 col-md-4");
        var el6 = dom.createTextNode("\n                      ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createComment(" /row ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n                ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","row");
        var el5 = dom.createTextNode("\n                    ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","col-xs-6 col-sm-3 col-md-4");
        var el6 = dom.createTextNode("\n                      ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                    ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","col-xs-6 col-sm-3 col-md-4");
        var el6 = dom.createTextNode("\n                      ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                    ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","col-xs-6 col-sm-3 col-md-4");
        var el6 = dom.createTextNode("\n                      ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createComment(" /row ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-xs-5 col-sm-4 col-md-4");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"style","width:100%;");
        var el5 = dom.createTextNode("\n              ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createComment(" /row ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row row-tile-pf");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-xs-7 col-sm-8 col-md-8");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","tile-pf");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","tile-pf-heading");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h2");
        dom.setAttribute(el6,"class","tile-pf-title");
        var el7 = dom.createTextNode("Utilization");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","tile-pf-body");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","row");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","col-xs-6 col-sm-3 col-md-3");
        var el8 = dom.createTextNode("\n                          ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","col-xs-6 col-sm-3 col-md-3");
        var el8 = dom.createTextNode("\n                          ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","col-xs-6 col-sm-3 col-md-3");
        var el8 = dom.createTextNode("\n                          ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","col-xs-6 col-sm-3 col-md-3");
        var el8 = dom.createTextNode("\n                          ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-xs-5 col-sm-4 col-md-4");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","tile-pf");
        var el5 = dom.createTextNode("\n              ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","tile-pf-heading");
        var el6 = dom.createTextNode("\n                  ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h2");
        dom.setAttribute(el6,"class","tile-pf-title");
        var el7 = dom.createTextNode("Quotas");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n              ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n              ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","tile-pf-body");
        var el6 = dom.createTextNode("\n                  ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","row");
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","quota-chart-row col-xs-12");
        var el8 = dom.createTextNode("\n                      ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                    ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","quota-chart-row col-xs-12");
        var el8 = dom.createTextNode("\n                      ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                    ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","quota-chart-row col-xs-12");
        var el8 = dom.createTextNode("\n                      ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                    ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","quota-chart-row col-xs-12");
        var el8 = dom.createTextNode("\n                      ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                    ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                  ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n              ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createComment(" /row ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row row-tile-pf row-tile-pf-last");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-md-12");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","tile-pf");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","tile-pf-heading");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h2");
        dom.setAttribute(el6,"class","tile-pf-title");
        var el7 = dom.createTextNode("Utilization By Nodes");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","container-heatmap-body");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","row");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","col-xs-18 col-sm-9 col-md-9 usage-heatmap-body flex-vertical-container");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        var el9 = dom.createTextNode("\n                              ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("div");
        dom.setAttribute(el9,"class","col-xs-8 col-sm-4 col-md-4 container-heatmap-tile");
        var el10 = dom.createTextNode("\n                                ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("h3");
        dom.setAttribute(el10,"class","h4 count-title");
        var el11 = dom.createTextNode("CPU");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                                ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("div");
        dom.setAttribute(el10,"style","width:100%; height:180px;");
        var el11 = dom.createTextNode("\n                                  ");
        dom.appendChild(el10, el11);
        var el11 = dom.createComment("");
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n                                ");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                              ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                              ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("div");
        dom.setAttribute(el9,"class","col-xs-8 col-sm-4 col-md-4 container-heatmap-tile");
        var el10 = dom.createTextNode("\n                                ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("h3");
        dom.setAttribute(el10,"class","h4 count-title");
        var el11 = dom.createTextNode("Memory");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                                ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("div");
        dom.setAttribute(el10,"style","width:100%; height:180px;");
        var el11 = dom.createTextNode("\n                                  ");
        dom.appendChild(el10, el11);
        var el11 = dom.createComment("");
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n                                ");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                              ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                              ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("div");
        dom.setAttribute(el9,"class","col-xs-8 col-sm-4 col-md-4 container-heatmap-tile");
        var el10 = dom.createTextNode("\n                                ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("h3");
        dom.setAttribute(el10,"class","h4 count-title");
        var el11 = dom.createTextNode("Storage");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                                ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("div");
        dom.setAttribute(el10,"style","width:100%; height:180px;");
        var el11 = dom.createTextNode("\n                                  ");
        dom.appendChild(el10, el11);
        var el11 = dom.createComment("");
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n                                ");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                              ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8,"class","col-xs-16 col-sm-8 col-md-8");
        var el9 = dom.createTextNode("\n                                  ");
        dom.appendChild(el8, el9);
        var el9 = dom.createComment("");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","col-xs-6 col-sm-3 col-md-3 container-heatmap-tile network-heatmap-body flex-vertical-container");
        var el8 = dom.createTextNode("\n                          ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h3");
        dom.setAttribute(el8,"class","h4 count-title");
        var el9 = dom.createTextNode("Network");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                          ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8,"style","width:100%; height:180px;");
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        var el9 = dom.createComment("");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                          ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                          ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8,"style","height:5px");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                          ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createComment(" /container ");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [2]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element1, [1]);
        var element3 = dom.childAt(element2, [1]);
        var element4 = dom.childAt(element2, [4]);
        var element5 = dom.childAt(element0, [4]);
        var element6 = dom.childAt(element5, [1, 1, 3, 1]);
        var element7 = dom.childAt(element5, [3, 1, 3, 1]);
        var element8 = dom.childAt(element0, [7, 1, 1, 3, 1]);
        var element9 = dom.childAt(element8, [1]);
        var element10 = dom.childAt(element9, [1]);
        var element11 = dom.childAt(element8, [3]);
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        var morph1 = dom.createMorphAt(dom.childAt(element3, [1]),1,1);
        var morph2 = dom.createMorphAt(dom.childAt(element3, [3]),1,1);
        var morph3 = dom.createMorphAt(dom.childAt(element3, [5]),1,1);
        var morph4 = dom.createMorphAt(dom.childAt(element4, [1]),1,1);
        var morph5 = dom.createMorphAt(dom.childAt(element4, [3]),1,1);
        var morph6 = dom.createMorphAt(dom.childAt(element4, [5]),1,1);
        var morph7 = dom.createMorphAt(dom.childAt(element1, [3, 1]),1,1);
        var morph8 = dom.createMorphAt(dom.childAt(element6, [1]),1,1);
        var morph9 = dom.createMorphAt(dom.childAt(element6, [3]),1,1);
        var morph10 = dom.createMorphAt(dom.childAt(element6, [5]),1,1);
        var morph11 = dom.createMorphAt(dom.childAt(element6, [7]),1,1);
        var morph12 = dom.createMorphAt(dom.childAt(element7, [1]),1,1);
        var morph13 = dom.createMorphAt(dom.childAt(element7, [3]),1,1);
        var morph14 = dom.createMorphAt(dom.childAt(element7, [5]),1,1);
        var morph15 = dom.createMorphAt(dom.childAt(element7, [7]),1,1);
        var morph16 = dom.createMorphAt(dom.childAt(element10, [1, 3]),1,1);
        var morph17 = dom.createMorphAt(dom.childAt(element10, [3, 3]),1,1);
        var morph18 = dom.createMorphAt(dom.childAt(element10, [5, 3]),1,1);
        var morph19 = dom.createMorphAt(dom.childAt(element9, [3]),1,1);
        var morph20 = dom.createMorphAt(dom.childAt(element11, [3]),1,1);
        var morph21 = dom.createMorphAt(element11,7,7);
        dom.insertBoundary(fragment, 0);
        inline(env, morph0, context, "bread-crumb-bar", [], {"breadCrumbs": get(env, context, "crumbs")});
        inline(env, morph1, context, "aggregate-status-chart", [], {"aggregateType": "Nodes", "aggregateCount": get(env, context, "model.nodes.count"), "errorCount": get(env, context, "model.nodes.errorCount"), "aggregateTypeIconClass": "pficon-container-node"});
        inline(env, morph2, context, "object-status-chart", [], {"objectType": "Containers", "objectCount": get(env, context, "model.containers.count"), "typeIconClass": "fa-cube"});
        inline(env, morph3, context, "object-status-chart", [], {"objectType": "Routes", "objectCount": get(env, context, "model.routes.count"), "typeIconClass": "pficon-route"});
        inline(env, morph4, context, "aggregate-status-chart", [], {"aggregateType": "Container Groups", "aggregateCount": get(env, context, "model.containerGroups.count"), "errorCount": get(env, context, "model.containerGroups.errorCount"), "aggregateTypeIconClass": "fa-cubes"});
        inline(env, morph5, context, "object-status-chart", [], {"objectType": "Services", "objectCount": get(env, context, "model.services.count"), "typeIconClass": "pficon-service"});
        inline(env, morph6, context, "object-status-chart", [], {"objectType": "Images", "objectCount": get(env, context, "model.images.count"), "typeIconClass": "pficon-image"});
        inline(env, morph7, context, "container-group-creation-trends", [], {"data": get(env, context, "model.containerGroupTrends")});
        inline(env, morph8, context, "utilization-chart", [], {"title": "CPU", "data": get(env, context, "model.cpuUsage"), "totalUnits": "MHz"});
        inline(env, morph9, context, "utilization-chart", [], {"title": "Memory", "data": get(env, context, "model.memoryUsage"), "totalUnits": "GB"});
        inline(env, morph10, context, "utilization-chart", [], {"title": "Storage", "data": get(env, context, "model.storageUsage"), "totalUnits": "TB"});
        inline(env, morph11, context, "utilization-chart", [], {"title": "Network", "data": get(env, context, "model.networkUsage"), "totalUnits": "Gbps"});
        inline(env, morph12, context, "quota-chart", [], {"title": "CPU", "data": get(env, context, "model.cpuQuota")});
        inline(env, morph13, context, "quota-chart", [], {"title": "Memory", "data": get(env, context, "model.memoryQuota")});
        inline(env, morph14, context, "quota-chart", [], {"title": "Container Groups", "data": get(env, context, "model.containerGroupQuota")});
        inline(env, morph15, context, "quota-chart", [], {"title": "Services", "data": get(env, context, "model.servicesQuota")});
        inline(env, morph16, context, "heat-map", [], {"data": get(env, context, "model.nodeCpuUsage.data"), "click": "heatMapClicked"});
        inline(env, morph17, context, "heat-map", [], {"data": get(env, context, "model.nodeMemoryUsage.data"), "click": "heatMapClicked"});
        inline(env, morph18, context, "heat-map", [], {"data": get(env, context, "model.nodeStorageUsage.data"), "click": "heatMapClicked"});
        inline(env, morph19, context, "heat-map-legend", [], {"legendLabels": get(env, context, "nodeHeatMapUsageLegendLabels")});
        inline(env, morph20, context, "heat-map", [], {"data": get(env, context, "model.nodeNetworkUsage.data"), "click": "heatMapClicked"});
        inline(env, morph21, context, "heat-map-legend", [], {"legendLabels": get(env, context, "nodeHeatMapNetworkLegendLabels")});
        return fragment;
      }
    };
  }()));

});
define('dashboard/templates/containers/providers', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","container-fluid container-tiles-pf");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row row-tile-pf");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-xs-6 col-sm-4 col-md-2");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-xs-12 col-sm-12 col-md-10");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","row");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","col-xs-6 col-sm-6 col-md-3");
        var el6 = dom.createTextNode("\n                  ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","col-xs-6 col-sm-6 col-md-3");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","col-xs-6 col-sm-6 col-md-3");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","col-xs-6 col-sm-6 col-md-3");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createComment(" /row ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","row");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","col-xs-6 col-sm-6 col-md-3");
        var el6 = dom.createTextNode("\n                  ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","col-xs-6 col-sm-6 col-md-3");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","col-xs-6 col-sm-6 col-md-3");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","col-xs-6 col-sm-6 col-md-3");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createComment(" /row ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createComment(" /row ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row row-tile-pf");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-xs-7 col-sm-8 col-md-8");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","tile-pf");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","tile-pf-heading");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h2");
        dom.setAttribute(el6,"class","tile-pf-title");
        var el7 = dom.createTextNode("Utilization");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","tile-pf-body");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","row");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","col-xs-6 col-sm-3 col-md-3");
        var el8 = dom.createTextNode("\n                          ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","col-xs-6 col-sm-3 col-md-3");
        var el8 = dom.createTextNode("\n                          ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","col-xs-6 col-sm-3 col-md-3");
        var el8 = dom.createTextNode("\n                          ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","col-xs-6 col-sm-3 col-md-3");
        var el8 = dom.createTextNode("\n                          ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-xs-5 col-sm-4 col-md-4");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"style","width:100%;");
        var el5 = dom.createTextNode("\n              ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"style","width:100%;");
        var el5 = dom.createTextNode("\n              ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createComment(" /row ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row row-tile-pf row-tile-pf-last");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-md-12");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","tile-pf");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","tile-pf-heading");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h2");
        dom.setAttribute(el6,"class","tile-pf-title");
        var el7 = dom.createTextNode("Utilization By Nodes");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","container-heatmap-body");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","row");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","col-xs-18 col-sm-9 col-md-9 usage-heatmap-body flex-vertical-container");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        var el9 = dom.createTextNode("\n                              ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("div");
        dom.setAttribute(el9,"class","col-xs-8 col-sm-4 col-md-4 container-heatmap-tile");
        var el10 = dom.createTextNode("\n                                ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("h3");
        dom.setAttribute(el10,"class","h4 count-title");
        var el11 = dom.createTextNode("CPU");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                                ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("div");
        dom.setAttribute(el10,"style","width:100%; height:180px;");
        var el11 = dom.createTextNode("\n                                  ");
        dom.appendChild(el10, el11);
        var el11 = dom.createComment("");
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n                                ");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                              ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                              ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("div");
        dom.setAttribute(el9,"class","col-xs-8 col-sm-4 col-md-4 container-heatmap-tile");
        var el10 = dom.createTextNode("\n                                ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("h3");
        dom.setAttribute(el10,"class","h4 count-title");
        var el11 = dom.createTextNode("Memory");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                                ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("div");
        dom.setAttribute(el10,"style","width:100%; height:180px;");
        var el11 = dom.createTextNode("\n                                  ");
        dom.appendChild(el10, el11);
        var el11 = dom.createComment("");
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n                                ");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                              ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                              ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("div");
        dom.setAttribute(el9,"class","col-xs-8 col-sm-4 col-md-4 container-heatmap-tile");
        var el10 = dom.createTextNode("\n                                ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("h3");
        dom.setAttribute(el10,"class","h4 count-title");
        var el11 = dom.createTextNode("Storage");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                                ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("div");
        dom.setAttribute(el10,"style","width:100%; height:180px;");
        var el11 = dom.createTextNode("\n                                  ");
        dom.appendChild(el10, el11);
        var el11 = dom.createComment("");
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n                                ");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                              ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8,"class","col-xs-16 col-sm-8 col-md-8");
        var el9 = dom.createTextNode("\n                                  ");
        dom.appendChild(el8, el9);
        var el9 = dom.createComment("");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","col-xs-6 col-sm-3 col-md-3 container-heatmap-tile network-heatmap-body flex-vertical-container");
        var el8 = dom.createTextNode("\n                          ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h3");
        dom.setAttribute(el8,"class","h4 count-title");
        var el9 = dom.createTextNode("Network");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                          ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8,"style","width:100%; height:180px;");
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        var el9 = dom.createComment("");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                          ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                          ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8,"style","height:5px");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                          ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createComment(" /container ");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [2]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element1, [3]);
        var element3 = dom.childAt(element2, [1]);
        var element4 = dom.childAt(element2, [4]);
        var element5 = dom.childAt(element0, [4]);
        var element6 = dom.childAt(element5, [1, 1, 3, 1]);
        var element7 = dom.childAt(element5, [3]);
        var element8 = dom.childAt(element0, [7, 1, 1, 3, 1]);
        var element9 = dom.childAt(element8, [1]);
        var element10 = dom.childAt(element9, [1]);
        var element11 = dom.childAt(element8, [3]);
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        var morph1 = dom.createMorphAt(dom.childAt(element1, [1]),1,1);
        var morph2 = dom.createMorphAt(dom.childAt(element3, [1]),1,1);
        var morph3 = dom.createMorphAt(dom.childAt(element3, [3]),1,1);
        var morph4 = dom.createMorphAt(dom.childAt(element3, [5]),1,1);
        var morph5 = dom.createMorphAt(dom.childAt(element3, [7]),1,1);
        var morph6 = dom.createMorphAt(dom.childAt(element4, [1]),1,1);
        var morph7 = dom.createMorphAt(dom.childAt(element4, [3]),1,1);
        var morph8 = dom.createMorphAt(dom.childAt(element4, [5]),1,1);
        var morph9 = dom.createMorphAt(dom.childAt(element4, [7]),1,1);
        var morph10 = dom.createMorphAt(dom.childAt(element6, [1]),1,1);
        var morph11 = dom.createMorphAt(dom.childAt(element6, [3]),1,1);
        var morph12 = dom.createMorphAt(dom.childAt(element6, [5]),1,1);
        var morph13 = dom.createMorphAt(dom.childAt(element6, [7]),1,1);
        var morph14 = dom.createMorphAt(dom.childAt(element7, [1]),1,1);
        var morph15 = dom.createMorphAt(dom.childAt(element7, [3]),1,1);
        var morph16 = dom.createMorphAt(dom.childAt(element10, [1, 3]),1,1);
        var morph17 = dom.createMorphAt(dom.childAt(element10, [3, 3]),1,1);
        var morph18 = dom.createMorphAt(dom.childAt(element10, [5, 3]),1,1);
        var morph19 = dom.createMorphAt(dom.childAt(element9, [3]),1,1);
        var morph20 = dom.createMorphAt(dom.childAt(element11, [3]),1,1);
        var morph21 = dom.createMorphAt(element11,7,7);
        dom.insertBoundary(fragment, 0);
        inline(env, morph0, context, "bread-crumb-bar", [], {"breadCrumbs": get(env, context, "crumbs")});
        inline(env, morph1, context, "provider-type-tile", [], {"numProviders": get(env, context, "providerCount"), "providerType": get(env, context, "provider_type")});
        inline(env, morph2, context, "aggregate-status-chart", [], {"aggregateType": "Nodes", "aggregateCount": get(env, context, "model.nodes.count"), "errorCount": get(env, context, "model.nodes.errorCount"), "aggregateTypeIconClass": "pficon-container-node"});
        inline(env, morph3, context, "object-status-chart", [], {"objectType": "Containers", "objectCount": get(env, context, "model.containers.count"), "typeIconClass": "fa-cube"});
        inline(env, morph4, context, "object-status-chart", [], {"objectType": "Registries", "objectCount": get(env, context, "model.registries.count"), "typeIconClass": "pficon-registry"});
        inline(env, morph5, context, "object-status-chart", [], {"objectType": "Projects", "objectCount": get(env, context, "model.projects.count"), "typeIconClass": "pficon-project", "linkRoute": "containers.projects", "objectId": get(env, context, "projectId")});
        inline(env, morph6, context, "aggregate-status-chart", [], {"aggregateType": "Container Groups", "aggregateCount": get(env, context, "model.containerGroups.count"), "errorCount": get(env, context, "model.containerGroups.errorCount"), "aggregateTypeIconClass": "fa-cubes"});
        inline(env, morph7, context, "object-status-chart", [], {"objectType": "Services", "objectCount": get(env, context, "model.services.count"), "typeIconClass": "pficon-service"});
        inline(env, morph8, context, "object-status-chart", [], {"objectType": "Images", "objectCount": get(env, context, "model.images.count"), "typeIconClass": "pficon-image"});
        inline(env, morph9, context, "object-status-chart", [], {"objectType": "Routes", "objectCount": get(env, context, "model.routes.count"), "typeIconClass": "pficon-route"});
        inline(env, morph10, context, "utilization-chart", [], {"title": "CPU", "data": get(env, context, "model.cpuUsage"), "totalUnits": "MHz"});
        inline(env, morph11, context, "utilization-chart", [], {"title": "Memory", "data": get(env, context, "model.memoryUsage"), "totalUnits": "GB"});
        inline(env, morph12, context, "utilization-chart", [], {"title": "Storage", "data": get(env, context, "model.storageUsage"), "totalUnits": "TB"});
        inline(env, morph13, context, "utilization-chart", [], {"title": "Network", "data": get(env, context, "model.networkUsage"), "totalUnits": "Gbps"});
        inline(env, morph14, context, "container-group-creation-trends", [], {"data": get(env, context, "model.containerGroupTrends")});
        inline(env, morph15, context, "image-creation-trends", [], {"data": get(env, context, "model.imageCreations")});
        inline(env, morph16, context, "heat-map", [], {"data": get(env, context, "model.nodeCpuUsage.data"), "click": "heatMapClicked"});
        inline(env, morph17, context, "heat-map", [], {"data": get(env, context, "model.nodeMemoryUsage.data"), "click": "heatMapClicked"});
        inline(env, morph18, context, "heat-map", [], {"data": get(env, context, "model.nodeStorageUsage.data"), "click": "heatMapClicked"});
        inline(env, morph19, context, "heat-map-legend", [], {"legendLabels": get(env, context, "nodeHeatMapUsageLegendLabels")});
        inline(env, morph20, context, "heat-map", [], {"data": get(env, context, "model.nodeNetworkUsage.data"), "click": "heatMapClicked"});
        inline(env, morph21, context, "heat-map-legend", [], {"legendLabels": get(env, context, "nodeHeatMapNetworkLegendLabels")});
        return fragment;
      }
    };
  }()));

});
define('dashboard/templates/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","container-fluid container-tiles-pf");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row row-tile-pf");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-xs-6 col-sm-4 col-md-2");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-xs-12 col-sm-12 col-md-10");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","row");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","col-xs-6 col-sm-6 col-md-3");
        var el6 = dom.createTextNode("\n                  ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","col-xs-6 col-sm-6 col-md-3");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","col-xs-6 col-sm-6 col-md-3");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","col-xs-6 col-sm-6 col-md-3");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createComment(" /row ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","row");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","col-xs-6 col-sm-6 col-md-3");
        var el6 = dom.createTextNode("\n                  ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","col-xs-6 col-sm-6 col-md-3");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","col-xs-6 col-sm-6 col-md-3");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","col-xs-6 col-sm-6 col-md-3");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createComment(" /row ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createComment(" /row ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row row-tile-pf");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-xs-7 col-sm-8 col-md-8");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","tile-pf");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","tile-pf-heading");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h2");
        dom.setAttribute(el6,"class","tile-pf-title");
        var el7 = dom.createTextNode("Utilization");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","tile-pf-body");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","row");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","col-xs-6 col-sm-3 col-md-3");
        var el8 = dom.createTextNode("\n                          ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","col-xs-6 col-sm-3 col-md-3");
        var el8 = dom.createTextNode("\n                          ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","col-xs-6 col-sm-3 col-md-3");
        var el8 = dom.createTextNode("\n                          ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","col-xs-6 col-sm-3 col-md-3");
        var el8 = dom.createTextNode("\n                          ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-xs-5 col-sm-4 col-md-4");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"style","width:100%;");
        var el5 = dom.createTextNode("\n              ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"style","width:100%;");
        var el5 = dom.createTextNode("\n              ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createComment(" /row ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row row-tile-pf row-tile-pf-last");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-md-12");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","tile-pf");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","tile-pf-heading");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("h2");
        dom.setAttribute(el6,"class","tile-pf-title");
        var el7 = dom.createTextNode("Utilization By Nodes");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","container-heatmap-body");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","row");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","col-xs-18 col-sm-9 col-md-9 usage-heatmap-body flex-vertical-container");
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        var el9 = dom.createTextNode("\n                              ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("div");
        dom.setAttribute(el9,"class","col-xs-8 col-sm-4 col-md-4 container-heatmap-tile");
        var el10 = dom.createTextNode("\n                                ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("h3");
        dom.setAttribute(el10,"class","h4 count-title");
        var el11 = dom.createTextNode("CPU");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                                ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("div");
        dom.setAttribute(el10,"style","width:100%; height:180px;");
        var el11 = dom.createTextNode("\n                                  ");
        dom.appendChild(el10, el11);
        var el11 = dom.createComment("");
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n                                ");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                              ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                              ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("div");
        dom.setAttribute(el9,"class","col-xs-8 col-sm-4 col-md-4 container-heatmap-tile");
        var el10 = dom.createTextNode("\n                                ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("h3");
        dom.setAttribute(el10,"class","h4 count-title");
        var el11 = dom.createTextNode("Memory");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                                ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("div");
        dom.setAttribute(el10,"style","width:100%; height:180px;");
        var el11 = dom.createTextNode("\n                                  ");
        dom.appendChild(el10, el11);
        var el11 = dom.createComment("");
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n                                ");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                              ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                              ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("div");
        dom.setAttribute(el9,"class","col-xs-8 col-sm-4 col-md-4 container-heatmap-tile");
        var el10 = dom.createTextNode("\n                                ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("h3");
        dom.setAttribute(el10,"class","h4 count-title");
        var el11 = dom.createTextNode("Storage");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                                ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("div");
        dom.setAttribute(el10,"style","width:100%; height:180px;");
        var el11 = dom.createTextNode("\n                                  ");
        dom.appendChild(el10, el11);
        var el11 = dom.createComment("");
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n                                ");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                              ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8,"class","col-xs-16 col-sm-8 col-md-8");
        var el9 = dom.createTextNode("\n                                  ");
        dom.appendChild(el8, el9);
        var el9 = dom.createComment("");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","col-xs-6 col-sm-3 col-md-3 container-heatmap-tile network-heatmap-body flex-vertical-container");
        var el8 = dom.createTextNode("\n                          ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h3");
        dom.setAttribute(el8,"class","h4 count-title");
        var el9 = dom.createTextNode("Network");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                          ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8,"style","width:100%; height:180px;");
        var el9 = dom.createTextNode("\n                            ");
        dom.appendChild(el8, el9);
        var el9 = dom.createComment("");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                          ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                          ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8,"style","height:5px");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                          ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n                        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createComment(" /container ");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element1, [3]);
        var element3 = dom.childAt(element2, [1]);
        var element4 = dom.childAt(element2, [4]);
        var element5 = dom.childAt(element0, [4]);
        var element6 = dom.childAt(element5, [1, 1, 3, 1]);
        var element7 = dom.childAt(element5, [3]);
        var element8 = dom.childAt(element0, [7, 1, 1, 3, 1]);
        var element9 = dom.childAt(element8, [1]);
        var element10 = dom.childAt(element9, [1]);
        var element11 = dom.childAt(element8, [3]);
        var morph0 = dom.createMorphAt(dom.childAt(element1, [1]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element3, [1]),1,1);
        var morph2 = dom.createMorphAt(dom.childAt(element3, [3]),1,1);
        var morph3 = dom.createMorphAt(dom.childAt(element3, [5]),1,1);
        var morph4 = dom.createMorphAt(dom.childAt(element3, [7]),1,1);
        var morph5 = dom.createMorphAt(dom.childAt(element4, [1]),1,1);
        var morph6 = dom.createMorphAt(dom.childAt(element4, [3]),1,1);
        var morph7 = dom.createMorphAt(dom.childAt(element4, [5]),1,1);
        var morph8 = dom.createMorphAt(dom.childAt(element4, [7]),1,1);
        var morph9 = dom.createMorphAt(dom.childAt(element6, [1]),1,1);
        var morph10 = dom.createMorphAt(dom.childAt(element6, [3]),1,1);
        var morph11 = dom.createMorphAt(dom.childAt(element6, [5]),1,1);
        var morph12 = dom.createMorphAt(dom.childAt(element6, [7]),1,1);
        var morph13 = dom.createMorphAt(dom.childAt(element7, [1]),1,1);
        var morph14 = dom.createMorphAt(dom.childAt(element7, [3]),1,1);
        var morph15 = dom.createMorphAt(dom.childAt(element10, [1, 3]),1,1);
        var morph16 = dom.createMorphAt(dom.childAt(element10, [3, 3]),1,1);
        var morph17 = dom.createMorphAt(dom.childAt(element10, [5, 3]),1,1);
        var morph18 = dom.createMorphAt(dom.childAt(element9, [3]),1,1);
        var morph19 = dom.createMorphAt(dom.childAt(element11, [3]),1,1);
        var morph20 = dom.createMorphAt(element11,7,7);
        inline(env, morph0, context, "providers-status-chart", [], {"openShiftCount": get(env, context, "model.providers.openshift.count"), "kubernetesCount": get(env, context, "model.providers.kubernetes.count")});
        inline(env, morph1, context, "aggregate-status-chart", [], {"aggregateType": "Nodes", "aggregateCount": get(env, context, "model.nodes.count"), "errorCount": get(env, context, "model.nodes.errorCount"), "aggregateTypeIconClass": "pficon-container-node"});
        inline(env, morph2, context, "object-status-chart", [], {"objectType": "Containers", "objectCount": get(env, context, "model.containers.count"), "typeIconClass": "fa-cube"});
        inline(env, morph3, context, "object-status-chart", [], {"objectType": "Registries", "objectCount": get(env, context, "model.registries.count"), "typeIconClass": "pficon-registry"});
        inline(env, morph4, context, "object-status-chart", [], {"objectType": "Projects", "objectCount": get(env, context, "model.projects.count"), "typeIconClass": "pficon-project", "linkRoute": "containers.projects"});
        inline(env, morph5, context, "aggregate-status-chart", [], {"aggregateType": "Container Groups", "aggregateCount": get(env, context, "model.containerGroups.count"), "errorCount": get(env, context, "model.containerGroups.errorCount"), "aggregateTypeIconClass": "fa-cubes"});
        inline(env, morph6, context, "object-status-chart", [], {"objectType": "Services", "objectCount": get(env, context, "model.services.count"), "typeIconClass": "pficon-service"});
        inline(env, morph7, context, "object-status-chart", [], {"objectType": "Images", "objectCount": get(env, context, "model.images.count"), "typeIconClass": "pficon-image"});
        inline(env, morph8, context, "object-status-chart", [], {"objectType": "Routes", "objectCount": get(env, context, "model.routes.count"), "typeIconClass": "pficon-route"});
        inline(env, morph9, context, "utilization-chart", [], {"title": "CPU", "data": get(env, context, "model.cpuUsage"), "totalUnits": "MHz"});
        inline(env, morph10, context, "utilization-chart", [], {"title": "Memory", "data": get(env, context, "model.memoryUsage"), "totalUnits": "GB"});
        inline(env, morph11, context, "utilization-chart", [], {"title": "Storage", "data": get(env, context, "model.storageUsage"), "totalUnits": "TB"});
        inline(env, morph12, context, "utilization-chart", [], {"title": "Network", "data": get(env, context, "model.networkUsage"), "totalUnits": "Gbps"});
        inline(env, morph13, context, "container-group-creation-trends", [], {"data": get(env, context, "model.containerGroupTrends")});
        inline(env, morph14, context, "image-creation-trends", [], {"data": get(env, context, "model.imageCreations")});
        inline(env, morph15, context, "heat-map", [], {"data": get(env, context, "model.nodeCpuUsage.data"), "click": "heatMapClicked"});
        inline(env, morph16, context, "heat-map", [], {"data": get(env, context, "model.nodeMemoryUsage.data"), "click": "heatMapClicked"});
        inline(env, morph17, context, "heat-map", [], {"data": get(env, context, "model.nodeStorageUsage.data"), "click": "heatMapClicked"});
        inline(env, morph18, context, "heat-map-legend", [], {"legendLabels": get(env, context, "nodeHeatMapUsageLegendLabels")});
        inline(env, morph19, context, "heat-map", [], {"data": get(env, context, "model.nodeNetworkUsage.data"), "click": "heatMapClicked"});
        inline(env, morph20, context, "heat-map-legend", [], {"legendLabels": get(env, context, "nodeHeatMapNetworkLegendLabels")});
        return fragment;
      }
    };
  }()));

});
define('dashboard/templates/sample-charts', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("Sample Charts");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","row");
        dom.setAttribute(el1,"style","background-color:#d0d0d0; padding-top: 10px;");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","col-md-3");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"style","background-color: #ffffff");
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","col-md-3");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","col-md-2");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","col-md-2");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","col-md-2");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","col-md-2");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [2]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [1, 1]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
        var morph2 = dom.createMorphAt(dom.childAt(element0, [5]),1,1);
        var morph3 = dom.createMorphAt(dom.childAt(element0, [7]),1,1);
        var morph4 = dom.createMorphAt(dom.childAt(element0, [9]),1,1);
        var morph5 = dom.createMorphAt(dom.childAt(element0, [11]),1,1);
        inline(env, morph0, context, "c3-chart", [], {"data": get(env, context, "model.sampleChartData")});
        inline(env, morph1, context, "utilization-chart", [], {"title": "CPU", "used": get(env, context, "model.cpuUsage.used"), "total": get(env, context, "model.cpuUsage.total"), "totalUnits": "MHz", "usageData": get(env, context, "model.cpuUsage.data")});
        inline(env, morph2, context, "aggregate-status-chart", [], {"aggregateType": "Nodes", "aggregateCount": get(env, context, "model.nodes.count"), "errorCount": get(env, context, "model.nodes.errorCount"), "aggregateTypeIconClass": "pficon-container-node"});
        inline(env, morph3, context, "aggregate-status-chart", [], {"aggregateType": "Pods", "aggregateCount": get(env, context, "model.pods.count"), "errorCount": get(env, context, "model.pods.errorCount"), "aggregateTypeIconClass": "fa-cubes"});
        inline(env, morph4, context, "object-status-chart", [], {"objectType": "Containers", "objectCount": get(env, context, "model.containers.count"), "typeIconClass": "fa-cube"});
        inline(env, morph5, context, "object-status-chart", [], {"objectType": "Services", "objectCount": get(env, context, "model.services.count"), "typeIconClass": "pficon-service"});
        return fragment;
      }
    };
  }()));

});
define('dashboard/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('dashboard/tests/components/aggregate-status-chart.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/aggregate-status-chart.js should pass jshint', function() { 
    ok(true, 'components/aggregate-status-chart.js should pass jshint.'); 
  });

});
define('dashboard/tests/components/bread-crumb-bar.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/bread-crumb-bar.js should pass jshint', function() { 
    ok(true, 'components/bread-crumb-bar.js should pass jshint.'); 
  });

});
define('dashboard/tests/components/container-group-creation-trends.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/container-group-creation-trends.js should pass jshint', function() { 
    ok(true, 'components/container-group-creation-trends.js should pass jshint.'); 
  });

});
define('dashboard/tests/components/heat-map-legend.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/heat-map-legend.js should pass jshint', function() { 
    ok(true, 'components/heat-map-legend.js should pass jshint.'); 
  });

});
define('dashboard/tests/components/heat-map.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/heat-map.js should pass jshint', function() { 
    ok(true, 'components/heat-map.js should pass jshint.'); 
  });

});
define('dashboard/tests/components/image-creation-trends.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/image-creation-trends.js should pass jshint', function() { 
    ok(true, 'components/image-creation-trends.js should pass jshint.'); 
  });

});
define('dashboard/tests/components/object-status-chart.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/object-status-chart.js should pass jshint', function() { 
    ok(true, 'components/object-status-chart.js should pass jshint.'); 
  });

});
define('dashboard/tests/components/provider-type-tile.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/provider-type-tile.js should pass jshint', function() { 
    ok(true, 'components/provider-type-tile.js should pass jshint.'); 
  });

});
define('dashboard/tests/components/providers-status-chart.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/providers-status-chart.js should pass jshint', function() { 
    ok(true, 'components/providers-status-chart.js should pass jshint.'); 
  });

});
define('dashboard/tests/components/quota-chart.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/quota-chart.js should pass jshint', function() { 
    ok(true, 'components/quota-chart.js should pass jshint.'); 
  });

});
define('dashboard/tests/components/utilization-chart.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/utilization-chart.js should pass jshint', function() { 
    ok(true, 'components/utilization-chart.js should pass jshint.'); 
  });

});
define('dashboard/tests/controllers/application.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/application.js should pass jshint', function() { 
    ok(true, 'controllers/application.js should pass jshint.'); 
  });

});
define('dashboard/tests/controllers/containers/projects.jshint', function () {

  'use strict';

  module('JSHint - controllers/containers');
  test('controllers/containers/projects.js should pass jshint', function() { 
    ok(true, 'controllers/containers/projects.js should pass jshint.'); 
  });

});
define('dashboard/tests/controllers/containers/providers.jshint', function () {

  'use strict';

  module('JSHint - controllers/containers');
  test('controllers/containers/providers.js should pass jshint', function() { 
    ok(true, 'controllers/containers/providers.js should pass jshint.'); 
  });

});
define('dashboard/tests/controllers/index.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/index.js should pass jshint', function() { 
    ok(true, 'controllers/index.js should pass jshint.'); 
  });

});
define('dashboard/tests/controllers/sample-charts.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/sample-charts.js should pass jshint', function() { 
    ok(true, 'controllers/sample-charts.js should pass jshint.'); 
  });

});
define('dashboard/tests/helpers/resolver', ['exports', 'ember/resolver', 'dashboard/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('dashboard/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('dashboard/tests/helpers/start-app', ['exports', 'ember', 'dashboard/app', 'dashboard/router', 'dashboard/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('dashboard/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('dashboard/tests/initializers/navbar-notification-service.jshint', function () {

  'use strict';

  module('JSHint - initializers');
  test('initializers/navbar-notification-service.js should pass jshint', function() { 
    ok(true, 'initializers/navbar-notification-service.js should pass jshint.'); 
  });

});
define('dashboard/tests/initializers/resize-notification-service.jshint', function () {

  'use strict';

  module('JSHint - initializers');
  test('initializers/resize-notification-service.js should pass jshint', function() { 
    ok(true, 'initializers/resize-notification-service.js should pass jshint.'); 
  });

});
define('dashboard/tests/mixins/charts-mixin.jshint', function () {

  'use strict';

  module('JSHint - mixins');
  test('mixins/charts-mixin.js should pass jshint', function() { 
    ok(true, 'mixins/charts-mixin.js should pass jshint.'); 
  });

});
define('dashboard/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('dashboard/tests/routes/application.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/application.js should pass jshint', function() { 
    ok(true, 'routes/application.js should pass jshint.'); 
  });

});
define('dashboard/tests/routes/containers/projects.jshint', function () {

  'use strict';

  module('JSHint - routes/containers');
  test('routes/containers/projects.js should pass jshint', function() { 
    ok(true, 'routes/containers/projects.js should pass jshint.'); 
  });

});
define('dashboard/tests/routes/containers/providers.jshint', function () {

  'use strict';

  module('JSHint - routes/containers');
  test('routes/containers/providers.js should pass jshint', function() { 
    ok(true, 'routes/containers/providers.js should pass jshint.'); 
  });

});
define('dashboard/tests/routes/index.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/index.js should pass jshint', function() { 
    ok(true, 'routes/index.js should pass jshint.'); 
  });

});
define('dashboard/tests/routes/sample-charts.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/sample-charts.js should pass jshint', function() { 
    ok(true, 'routes/sample-charts.js should pass jshint.'); 
  });

});
define('dashboard/tests/services/navbar-notification.jshint', function () {

  'use strict';

  module('JSHint - services');
  test('services/navbar-notification.js should pass jshint', function() { 
    ok(true, 'services/navbar-notification.js should pass jshint.'); 
  });

});
define('dashboard/tests/services/resize-notification.jshint', function () {

  'use strict';

  module('JSHint - services');
  test('services/resize-notification.js should pass jshint', function() { 
    ok(true, 'services/resize-notification.js should pass jshint.'); 
  });

});
define('dashboard/tests/test-helper', ['dashboard/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('dashboard/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('dashboard/config/environment', ['ember'], function(Ember) {
  var prefix = 'dashboard';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("dashboard/tests/test-helper");
} else {
  require("dashboard/app")["default"].create({"name":"dashboard","version":"0.0.0.cb823b86"});
}

/* jshint ignore:end */
//# sourceMappingURL=dashboard.map