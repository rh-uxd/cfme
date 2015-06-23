angular.module('appModule').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('modules/app/views/app.html',
    "I am an app"
  );

}]);
