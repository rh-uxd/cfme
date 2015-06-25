 angular.module( 'cfme.dashboardModule' ).directive('pfObjStatus', function() {
        return {
            restrict: 'A',
            scope: {
                objectType: '=type'
            },
            templateUrl: 'modules/dashboard/directives/objStatus.html'
        };
    });