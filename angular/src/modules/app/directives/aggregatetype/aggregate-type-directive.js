  angular.module( 'patternfly.pf-components' ).directive('pfAggregateTypeCard', function() {
        return {
            restrict: 'A',
            scope: {
                types: '='
            },
            templateUrl: 'modules/app/directives/aggregatetype/aggregate-type.html'
        };
    });