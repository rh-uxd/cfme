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
