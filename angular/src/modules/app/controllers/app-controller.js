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
				'href': '#/ci/dashboard',
				'children': [
					{
						'title': 'Dashboard',
						'href': '#/ci/dashboard'
					}
				]
			},
			{
				'title': 'Services',
				'href': '#/services/myservices',
				'children': [
					{
						'title': 'My Services',
						'href': '#/services/myservices'
					}
				]
			},
			{
				'title': 'Clouds',
				'href': '#/clouds/clouds',
				'children': [
					{
						'title': 'Providers',
						'href': '#/clouds/providers'
					}
				]
			},
			{
				'title': 'Intrastructure',
				'href': '#/infrastructure/providers',
				'children': [
					{
						'title': 'Providers',
						'href': '#/infrastructure/providers'
					}
				]
			},
			{
				'title': 'Containers',
				'href': '#/containers/dashboard',
				'class': 'active',
				'children': [
					{
						'title': 'Dashboard',
						'href': '#/containers/dashboard',
						'class': 'active'
					},
					{
						'title': 'Container Providers',
						'href': '#/containers/providers'
					},
					{
						'title': 'Projects',
						'href': '#/containers/projects'
					},
					{
						'title': 'Nodes',
						'href': '#/containers/nodes'
					},
					{
						'title': 'Container Groups',
						'href': '#/containers/groups'
					},
					{
						'title': 'Routes',
						'href': '#/containers/routes'
					},
					{
						'title': 'Replicators',
						'href': '#/containers/replicators'
					},
					{
						'title': 'Images',
						'href': '#/containers/images'
					},
					{
						'title': 'Image Registries',
						'href': '#/containers/imagereg'
					},
					{
						'title': 'Services',
						'href': '#/containers/serives'
					},
					{
						'title': 'Containers',
						'href': '#/containers/containers'
					},
					{
						'title': 'Topology',
						'href': '#/containers/topology'
					}
				]
			},
			{
				'title': 'Control',
				'href': '#/control/explorer',
				'children': [
					{
						'title': 'Explorer',
						'href': '#/control/explorer'
					}
				]
			},
			{
				'title': 'Automate',
				'href': '#/automate/explorer',
				'children': [
					{
						'title': 'Explorer',
						'href': '#/automate/explorer'
					}
				]
			},
			{
				'title': 'Optimize',
				'href': '#/optimize/utilize',
				'children': [
					{
						'title': 'Utilize',
						'href': '#/optimize/utilize'
					}
				]
			},
			{
				'title': 'Configure',
				'href': '#/configure/settings',
				'children': [
					{
						'title': 'My Settings',
						'href': '#/configure/settings'
					}
				]
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
