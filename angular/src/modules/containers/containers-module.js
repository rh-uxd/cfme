
angular.module( 'cfme.containersModule', ['cfme.containers.dashboardModule', 'cfme.containers.providersModule', 'cfme.containers.projectsModule']).config(function ($routeProvider) {
        $routeProvider
        	.when('/containers/dashboard', {
            	templateUrl: 'modules/containers/dashboard/views/dashboard.html',
                controller: 'containers.dashboardController',
                controllerAs: 'vm'
            })
            .when('/containers/projects', {
             	templateUrl: 'modules/containers/projects/views/projects.html',
                controller: 'containers.projectsController',
                controllerAs: 'vm'
             })
            .when('/containers/providers', {
           		templateUrl: 'modules/containers/providers/views/providers-tile.html',
                controller: 'containers.providersController',
                controllerAs: 'vm'
             })
             .when('/containers/providers/:id', {
           		templateUrl: 'modules/containers/providers/views/providers-tile.html',
                controller: 'containers.providersController',
                controllerAs: 'vm'
             })
    	});
