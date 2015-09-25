
angular.module( 'cfme.containersModule',
  ['cfme.containers.projectsModule',
   'cfme.containers.podsModule',
   'cfme.containers.providersModule',
   'cfme.containers.dashboardModule'])
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
      .when('/containers/projects/:id', {
        templateUrl: 'modules/containers/projects/project.html',
        controller: 'containers.projectController',
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
      .when('/containers/pods', {
        templateUrl: 'modules/containers/pods/pods.html',
        controller: 'containers.podsController',
        controllerAs: 'vm'
      })
      .when('/containers/pods/:id', {
        templateUrl: 'modules/containers/pods/pod.html',
        controller: 'containers.podController',
        controllerAs: 'vm'
      })
  }]);
