angular.module( 'cfme.card' ).directive('cfmeObjStatus', function() {
  'use strict';
  return {
    restrict: 'A',
    scope: {
      objectType: '=type',
      url: '='
    },
    templateUrl: 'modules/app/directives/card/objectstatus/object-status-tile.html'
  };
});
