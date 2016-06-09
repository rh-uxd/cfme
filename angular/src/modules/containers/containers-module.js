
angular.module( 'miq.containersModule',
  ['miq.containers.projectsModule',
   'miq.containers.podsModule',
   'miq.containers.providersModule',
   'miq.containers.dashboardModule'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/compute/containers/dashboard', {
        templateUrl: 'modules/containers/dashboard/dashboard.html',
        controller: 'containers.dashboardController'
      })
      .when('/compute/containers/projects', {
        templateUrl: 'modules/containers/projects/projects.html',
        controller: 'containers.projectsController'
      })
      .when('/compute/containers/projects/:id', {
        templateUrl: 'modules/containers/projects/project.html',
        controller: 'containers.projectController'
      })
      .when('/compute/containers/providers', {
        templateUrl: 'modules/containers/providers/providers.html',
        controller: 'containers.providersController'
      })
      .when('/compute/containers/providers/:id', {
        templateUrl: 'modules/containers/providers/providers.html',
        controller: 'containers.providersController'
      })
      .when('/compute/containers/providers/provider/:id', {
        templateUrl: 'modules/containers/providers/provider.html',
        controller: 'containers.providerController'
      })
      .when('/compute/containers/pods', {
        templateUrl: 'modules/containers/pods/pods.html',
        controller: 'containers.podsController'
      })
      .when('/compute/containers/pods/:id', {
        templateUrl: 'modules/containers/pods/pod.html',
        controller: 'containers.podController'
      })
  }]);
