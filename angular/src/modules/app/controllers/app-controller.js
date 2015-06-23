angular.module( 'cfme.appModule' )
    .controller( 'cfme.appController',
    ['$scope',
     '$rootScope',
     function( $scope,
         $rootScope) {

         'use strict';

         var vm = this;

         vm.username = 'Administrator';

         vm.navigationItems = [
			{
				'title': 'Cloud Intelligence',
				'href': '#/ci'
			},
			{
				'title': 'Services',
				'href': '#/services'
			},
			{
				'title': 'Clouds',
				'href': '#/clouds'
			},
			{
				'title': 'Intrastructure',
				'href': '#/intrastructure'
			},
			{
				'title': 'Containers',
				'href': '#/containers',
				'class': 'active',
				'children': [
					{
						'title': 'Nodes',
						'href': '#/nodes'
					},
					{
						'title': 'Container Groups',
						'href': '#/containergroups',
						'class': 'active'
					},
					{
						'title': 'Routes',
						'href': '#/routes'
					},
					{
						'title': 'Replicators',
						'href': '#/replicators'
					},
					{
						'title': 'Images',
						'href': '#/images'
					},
					{
						'title': 'Image Registries',
						'href': '#/imagereg'
					},
					{
						'title': 'Services',
						'href': '#/serives'
					},
					{
						'title': 'Containers',
						'href': '#/containers'
					},
					{
						'title': 'Topology',
						'href': '#/topology'
					}
				]
			},
			{
				'title': 'Control',
				'href': '#/control'
			},
			{
				'title': 'Automate',
				'href': '#/automate'
			},
			{
				'title': 'Optimize',
				'href': '#/optimize'
			},
			{
				'title': 'Configure',
				'href': '#/configure'
			}
		];

		vm.notifications = [
			{
				'text': 'Modified Datasources ExampleDS'
			},
			{
				'text': 'Error: System Failure'
			}
		];

		vm.clearNotifications = function() {
			vm.notifications = [];
		};

     }] );
