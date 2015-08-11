angular.module( 'cfme.charts' ).directive('inlineObjectStatus', function() {
  'use strict';
  return {
    restrict: 'A',
    scope: {
      objectType: '=type',
      url: '='
    },
    templateUrl: 'modules/app/directives/charts/inline-object-status.html'
  };
});
