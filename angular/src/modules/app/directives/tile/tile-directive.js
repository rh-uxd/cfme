angular.module( 'patternfly.pf-components' ).directive('pfTile', function() {
    return {
        restrict: 'A',
        transclude: true,
        scope: {
            headtitle: '@',
            subtitle: '@'
        },
        templateUrl: 'modules/app/directives/tile/tile.html'
    };
});
