angular.module( 'cfme.objStatusModule' )
    .controller( 'cfme.objStatusController',
    ['$scope',
     '$rootScope',
     function( $scope,
         $rootScope) {

         'use strict';

         $scope.containers = { typeName: 'Containers', typeIconClass: 'fa-cube', count: 300 };
         $scope.registries = { typeName: 'Registries', typeIconClass: 'pficon-registry', count: 4 };
         $scope.projects = { typeName: 'Projects', typeIconClass: 'pficon-project', count: 510 };
         $scope.services = { typeName: 'Services', typeIconClass: 'pficon-service', count: 2500 };
         $scope.images = { typeName: 'Images', typeIconClass: 'pficon-image', count: 2500 };
         $scope.routes = { typeName: 'Routes', typeIconClass: 'pficon-route', count: 2500 };

     }])
    .directive('pfObjStatus', function() {
        return {
            restrict: 'E',
            scope: {
                objectType: '=type'
            },
            templateUrl: 'modules/tiles/object-status/views/objStatus.html'
        };
    });
