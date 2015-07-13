
angular.module( 'cfme.containersModule', ['cfme.containers.projectsModule', 'cfme.containers.providersModule', 'cfme.containers.dashboardModule'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        	.when('/containers/dashboard', {
                templateUrl: 'modules/containers/dashboard/dashboard.html',
                controller: 'containers.dashboardController',
                controllerAs: 'vm'
            })
            .when('/containers/projects', {
                templateUrl: 'modules/containers/projects/projects.html',
                controller: 'containers.projectsController',
                controllerAs: 'vm'
             })
            .when('/containers/providers', {
                templateUrl: 'modules/containers/providers/providers.html',
                controller: 'containers.providersController',
                controllerAs: 'vm'
             })
             .when('/containers/providers/:id', {
                templateUrl: 'modules/containers/providers/providers.html',
                controller: 'containers.providersController',
                controllerAs: 'vm'
             })
    	}]);
