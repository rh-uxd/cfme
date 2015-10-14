
angular.module( 'miq.containersModule',
  ['miq.containers.projectsModule',
   'miq.containers.podsModule',
   'miq.containers.providersModule',
   'miq.containers.dashboardModule'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/containers/dashboard', {
        templateUrl: 'modules/containers/dashboard/dashboard.html',
        controller: 'containers.dashboardController'
      })
      .when('/containers/projects', {
        templateUrl: 'modules/containers/projects/projects.html',
        controller: 'containers.projectsController'
      })
      .when('/containers/projects/:id', {
        templateUrl: 'modules/containers/projects/project.html',
        controller: 'containers.projectController'
      })
      .when('/containers/providers', {
        templateUrl: 'modules/containers/providers/providers.html',
        controller: 'containers.providersController'
      })
      .when('/containers/providers/:id', {
        templateUrl: 'modules/containers/providers/providers.html',
        controller: 'containers.providersController'
      })
      .when('/containers/providers/provider/:id', {
        templateUrl: 'modules/containers/providers/provider.html',
        controller: 'containers.providerController'
      })
      .when('/containers/pods', {
        templateUrl: 'modules/containers/pods/pods.html',
        controller: 'containers.podsController'
      })
      .when('/containers/pods/:id', {
        templateUrl: 'modules/containers/pods/pod.html',
        controller: 'containers.podController'
      })
  }]);
