  angular.module( 'patternfly.pf-components' ).directive('pfProviderTile', function() {
        return {
            restrict: 'A',
            scope: {
                providers: '=providers'
            },
            templateUrl: 'modules/app/components/providers.html'
        };
    });