angular.module( 'cfme.dashboardModule' )
    .controller( 'dashboardController',
    ['$scope',
     '$translate',
     function( $scope, $translate, panelValidation ) {
        'use strict';


        // stash a ref to the controller object, and the various parent objects
        var vm = this;
        
        vm.status_widgets = [ 
                { typeName: 'Nodes', typeIconClass: 'pficon-container-node', count: 52, error: { errorIconClass: 'pficon-error-circle-o', errorCount: 3}},
                { typeName: 'Containers', typeIconClass: 'fa-cube', count: 300 },
                { typeName: 'Registries', typeIconClass: 'pficon-registry', count: 4 },
                { typeName: 'Projects', typeIconClass: 'pficon-project', count: 510 },
                { typeName: 'Container Groups', typeIconClass: 'fa-cubes', count: 1200, error: { errorIconClass: 'pficon-error-circle-o', errorCount: 3}},
                { typeName: 'Services', typeIconClass: 'pficon-service', count: 2500 },
                { typeName: 'Images', typeIconClass: 'pficon-image', count: 2500 },
                { typeName: 'Routes', typeIconClass: 'pficon-route', count: 300 }
            ];
        
    }] );