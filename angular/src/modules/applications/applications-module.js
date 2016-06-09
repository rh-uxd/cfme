
angular.module( 'miq.applicationsModule',
  [])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/applications', {
        templateUrl: 'modules/infrastructure/providers/provider.html',
        controller: 'infrastructure.providerController'
      })
  }]);
