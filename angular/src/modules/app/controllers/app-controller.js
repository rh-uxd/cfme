angular.module( 'cfme.appModule' )
    .controller( 'cfme.appController',
    ['$scope',
     '$rootScope',
     '$resource',
     function( $scope, $rootScope, $resource ) {

        'use strict';

        var vm = this;

        vm.username = 'Administrator';

        //Navigation should be loaded from a service
        vm.navigationItems = [];
		var Navigation = $resource('/navigation');
		Navigation.get(function(data) {
      		vm.navigationItems = data.data;
     	});

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
