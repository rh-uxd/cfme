
angular.module( 'miq.infrastructureModule',
  ['miq.infrastructure.providersModule'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/infrastructure/providers', {
        templateUrl: 'modules/infrastructure/providers/provider.html',
        controller: 'infrastructure.providerController'
      })
  }]);
