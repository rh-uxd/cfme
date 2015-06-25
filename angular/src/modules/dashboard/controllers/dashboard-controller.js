angular.module( 'cfme.dashboardModule' )
    .controller( 'dashboardController',
    ['$scope',
     '$translate',
     function( $scope, $translate, panelValidation ) {
        'use strict';


        // stash a ref to the controller object, and the various parent objects
        var vm = this;
        
        vm.status_widgets = [ 
                { name: 'Nodes', iconClass: 'pficon-container-node', count: 52, status: [{iconClass: 'pficon-error-circle-o', count: 3}]},
                { name: 'Containers', iconClass: 'fa-cube', count: 300 },
                { name: 'Registries', iconClass: 'pficon-registry', count: 4 },
                { name: 'Projects', iconClass: 'pficon-project', count: 510 },
                { name: 'Container Groups', iconClass: 'fa-cubes', count: 1200, status: [{iconClass: 'pficon-error-circle-o', count: 3}]},
                { name: 'Services', iconClass: 'pficon-service', count: 2500 },
                { name: 'Images', iconClass: 'pficon-image', count: 2500 },
                { name: 'Routes', iconClass: 'pficon-route', count: 300 }
            ];
        
        vm.providers = { name: 'Providers', count: 3, providers: [{iconClass: 'pficon-openshift', count: 1, href: "#openshift"}, {iconClass: 'pficon-kubernetes', count: 2, href:"#kubernetes"}]};
                

    }] );