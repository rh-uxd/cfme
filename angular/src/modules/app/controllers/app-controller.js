angular.module( 'cfme.appModule' )
    .controller( 'cfme.appController',
    ['$scope',
     '$rootScope',
     function( $scope,
         $rootScope) {

         'use strict';

         var vm = this;

         vm.username = "Administrator";

         vm.navigationItems = [
				{
					"title": "Cloud Intelligence",
					"href": "#/ci"
				},
				{
					"title": "Services",
					"href": "#/services"
				},
				{
					"title": "Clouds",
					"href": "#/clouds"
				},
				{
					"title": "Intrastructure",
					"href": "#/intrastructure"
				},
				{
					"title": "Control",
					"href": "#/control"
				},
				{
					"title": "Automate",
					"href": "#/automate"
				},
				{
					"title": "Optimize",
					"href": "#/optimize"
				},
				{
					"title": "Configure",
					"href": "#/configure"
				}
			];

     }] );
