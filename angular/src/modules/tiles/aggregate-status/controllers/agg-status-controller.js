angular.module( 'cfme.aggStatusModule' )
    .controller( 'cfme.aggStatusController',
    ['$scope',
     '$rootScope',
     function( $scope,
         $rootScope) {

         'use strict';
         var errorStatusIconClass = 'pficon-error-circle-o';
         var okStatusIconClass = 'pficon-ok';

         $scope.nodes = { typeName: 'Nodes', typeIconClass: 'pficon-container-node', count: 52, errorIconClass: errorStatusIconClass, errorCount: 3};
         $scope.pods  = { typeName: 'Container Groups', typeIconClass: 'fa-cubes', count: 1200, errorIconClass: errorStatusIconClass, errorCount: 3};

     }])
    .directive('pfAggStatus', function() {
        return {
            restrict: 'E',
            scope: {
                aggType: '=type'
            },
            templateUrl: 'modules/tiles/aggregate-status/views/aggStatus.html'
        };
    });
