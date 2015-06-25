 angular.module( 'patternfly.pf-components' ).directive('pfObjStatus', function() {
        return {
            restrict: 'A',
            scope: {
                objectType: '=type'
            },
            templateUrl: 'modules/app/components/objStatus.html'
        };
    });