define("ember-cli-app-version", ["ember-cli-app-version/index", "ember", "exports"], function(__index__, __Ember__, __exports__) {
  "use strict";
  __Ember__["default"].keys(__index__).forEach(function(key){
    __exports__[key] = __index__[key];
  });
});

define("ember-cli-content-security-policy", ["ember-cli-content-security-policy/index", "ember", "exports"], function(__index__, __Ember__, __exports__) {
  "use strict";
  __Ember__["default"].keys(__index__).forEach(function(key){
    __exports__[key] = __index__[key];
  });
});

define("ember-inline-svg", ["ember-inline-svg/index", "ember", "exports"], function(__index__, __Ember__, __exports__) {
  "use strict";
  __Ember__["default"].keys(__index__).forEach(function(key){
    __exports__[key] = __index__[key];
  });
});

define('ember-inline-svg/utils/general', ['exports'], function (exports) {

  'use strict';

  exports.dottify = dottify;
  exports.applyClass = applyClass;

  function dottify(path) {
    return path.replace(/\//g, '.');
  }

  // maybe this should be a component with tagName: 'svg' and strip the outer <svg> tag
  // so we can use standard component class stuff?

  function applyClass(svg, klass) {
    if (!klass) {
      return svg;
    }

    // now we have 2 problems...
    return svg.replace('<svg', '<svg class="' + klass + '"');
  }

});//# sourceMappingURL=addons.map