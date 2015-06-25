  angular.module( 'cfme.containers.dashboardModule' ).directive('pfProviderTile', function() {
        return {
            restrict: 'A',
            scope: {
                providers: '=providers'
            },
            templateUrl: 'modules/containers/dashboard/directives/providers.html'
        };
    });