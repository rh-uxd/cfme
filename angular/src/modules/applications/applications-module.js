
angular.module( 'miq.applicationsModule',
  [])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/applications', {
        templateUrl: 'modules/applications/applications.html',
        controller: 'applicationsController'
      })
  }]);
