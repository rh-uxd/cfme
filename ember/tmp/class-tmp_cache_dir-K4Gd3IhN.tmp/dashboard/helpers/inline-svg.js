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