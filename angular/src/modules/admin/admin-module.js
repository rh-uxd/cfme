
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
        templateUrl: 'modules/admin/user-admin/users.html',
        controller: 'userAdmin.usersController'
      })
      .when('/admin/user-admin/groups', {
        templateUrl: 'modules/admin/user-admin/groups.html',
        controller: 'userAdmin.groupsController'
      })
      .when('/admin/user-admin/roles', {
        templateUrl: 'modules/admin/user-admin/roles.html',
        controller: 'userAdmin.rolesController'
      })
      .when('/admin/backups', {
        templateUrl: 'modules/admin/backups.html',
        controller: 'admin.backupsController'
      })
      .when('/admin/automated-tasks', {
        templateUrl: 'modules/admin/automated-tasks.html',
        controller: 'admin.automatedTasksController'
      })
  }]);
