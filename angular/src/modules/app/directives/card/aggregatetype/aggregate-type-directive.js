angular.module( 'cfme.card' ).directive('cfmeAggregateTypeCard', function() {
  'use strict';
  return {
    restrict: 'A',
    scope: {
      types: '='
    },
    templateUrl: 'modules/app/directives/card/aggregatetype/aggregate-type.html'
  };
});
