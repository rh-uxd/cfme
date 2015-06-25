 angular.module( 'cfme.dashboardModule' ).directive('pfObjStatus', function() {
        return {
            restrict: 'E',
            scope: {
                objectType: '=type'
            },
            templateUrl: 'modules/dashboard/directives/objStatus.html'
        };
    });