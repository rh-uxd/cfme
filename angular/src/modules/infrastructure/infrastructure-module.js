
angular.module( 'miq.infrastructureModule',
  ['miq.infrastructure.providersModule'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/compute/infrastructure', {
        redirectTo: '/dashboard'
      })
      .when('/compute/infrastructure/providers', {
        templateUrl: 'modules/infrastructure/providers/providers.html',
        controller: 'infrastructure.providersController'
      })
      .when('/compute/infrastructure/providers/provider/:id', {
        templateUrl: 'modules/infrastructure/providers/provider.html',
        controller: 'infrastructure.providerController'
      })
  }]);
