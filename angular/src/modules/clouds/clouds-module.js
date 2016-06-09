
angular.module( 'miq.cloudsModule',
  [])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/compute/clouds', {
        templateUrl: 'modules/infrastructure/providers/provider.html',
        controller: 'infrastructure.providerController'
      })
  }]);
