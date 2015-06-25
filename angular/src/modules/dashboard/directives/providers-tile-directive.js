  angular.module( 'cfme.dashboardModule' ).directive('pfProviderTile', function() {
        return {
            restrict: 'A',
            scope: {
                providers: '=providers'
            },
            templateUrl: 'modules/dashboard/directives/providers.html'
        };
    });