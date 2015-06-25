 angular.module( 'cfme.containers.dashboardModule' ).directive('pfObjStatus', function() {
        return {
            restrict: 'A',
            scope: {
                objectType: '=type'
            },
            templateUrl: 'modules/containers/dashboard/directives/objStatus.html'
        };
    });