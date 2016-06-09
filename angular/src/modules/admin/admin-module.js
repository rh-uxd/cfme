
angular.module( 'miq.adminModule',
  ['miq.userAdminModule'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/admin', {
        redirectTo: '/admin/user-admin'
      })
      .when('/admin/user-admin', {
        redirectTo: '/admin/user-admin/users'
      })
      .when('/admin/user-admin/users', {
        templateUrl: 'modules/infrastructure/providers/provider.html',
        controller: 'infrastructure.providerController'
      })
      .when('/admin/user-admin/groups', {
        templateUrl: 'modules/infrastructure/providers/provider.html',
        controller: 'infrastructure.providerController'
      })
      .when('/admin/user-admin/roles', {
        templateUrl: 'modules/infrastructure/providers/provider.html',
        controller: 'infrastructure.providerController'
      })
      .when('/admin/backups', {
        templateUrl: 'modules/infrastructure/providers/provider.html',
        controller: 'infrastructure.providerController'
      })
      .when('/admin/automated-tasks', {
        templateUrl: 'modules/infrastructure/providers/provider.html',
        controller: 'infrastructure.providerController'
      })
  }]);
