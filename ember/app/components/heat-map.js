import Ember from 'ember';
import ChartsMixin from '../mixins/charts-mixin';

export default Ember.Component.extend(ChartsMixin, {

  tagName: 'svg',
  attributeBindings: ['width', 'height'],

  blockPadding: Ember.computed(function () {
    return this.get('default_heatmap_block_padding');
  }),

  color: Ember.computed(function () {
    return this.get('default_heatmap_color');
  }),

  rows: Ember.computed('height', 'blockSize', function () {
    var blockSize = this.get('blockSize');
    return (blockSize === 0) ? 0 : Math.floor(this.get('height') / blockSize);
  }),

  blockSize: 0,

  determineBlockSize: function  () {
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

  redrawTrigger: Ember.observer('blockSize', 'blockPadding', 'color', function () {
    Ember.run.once(this, 'redraw');
  }),

  didInsertElement: function ()
  {
    this.set('width', this.$().parents('div').width());
    this.set('height', this.$().parents('div').height());
    this.set('blockSize', this.determineBlockSize());
    this.redraw();
    this.resizeNotificationService.on( 'windowResizedLowLatency',
      this, this.handleResize );
  },

  willDestroyElement: function() {
    this.resizeNotificationService.off( 'windowResizedLowLatency',
      this, this.handleResize );
  },

  handleResize: function() {
    this.set('width', this.$().parents('div').width());
    this.set('height', this.$().parents('div').height());
    this.set('blockSize', this.determineBlockSize());
    this.redraw();
  },

  redraw: function () {
    var data = this.get('data');
    var rows = this.get('rows');
    var blockSize = this.get('blockSize');
    var blockPadding = this.get('blockPadding');
    var color = this.get('color');
    var component = this;

    function highlightBlock (block, active) {
      block.style('fill-opacity', active ? 1 : 0.4);
    }

    var svg = d3.select(this.element);
    svg.selectAll('*').remove();

    var blocks = svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect');

    blocks
      .attr('x', function (d, i) {
        return (Math.floor(i / rows) * blockSize) + blockPadding;
      })
      .attr('y', function (d, i) {
        return (i % rows * blockSize) + blockPadding;
      })
      .attr('width', blockSize - (2 * blockPadding))
      .attr('height', blockSize - (2 * blockPadding))
      .style('fill', function (d) {
        return color(d.value);
      });

    blocks
      .on('mouseover', function () {
        blocks
          .call(highlightBlock, false);

        d3.select(this)
          .call(highlightBlock, true);
      });

    blocks
      .on('click', function (d) {
        component.sendAction('click', d);
      });

    blocks
      .each(function (d) {
        $(this).tooltip({
          container: 'body',
          animation: false,
          placement: 'top',
          trigger: 'hover',
          html: true,
          title: d.tooltip
        });
      });

    svg
      .on('mouseleave', function () {
        blocks
          .call(highlightBlock, true);
      });
  }

});
