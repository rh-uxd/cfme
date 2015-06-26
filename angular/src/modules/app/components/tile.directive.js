angular.module( 'patternfly.pf-components' ).directive('pfTile', function() {
    return {
        restrict: 'A',
        transclude: true,
        scope: {
            title: '@',
            subtitle: '@'
        },
        templateUrl: 'modules/app/components/tile.directive.html'
    };
});
