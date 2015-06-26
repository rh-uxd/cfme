 angular.module( 'patternfly.pf-components' ).directive('pfObjStatus', function() {
        return {
            restrict: 'A',
            scope: {
                objectType: '=type',
                url: '='
            },
            templateUrl: 'modules/app/components/objStatus.html'
        };
    });