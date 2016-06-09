
angular.module( 'miq.eventsModule',
  [])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/events', {
        templateUrl: 'modules/infrastructure/providers/provider.html',
        controller: 'infrastructure.providerController'
      })
  }]);
