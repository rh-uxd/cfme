angular.module ('miq.appModule', [
  'ngResource',
  'ngRoute',
  'ui.bootstrap',
  'pascalprecht.translate',
  'patternfly',
  'patternfly.toolbars',
  'patternfly.charts',
  'miq.util',
  'miq.charts',
  'miq.card',
  'miq.dialogs',
  'miq.navigation',
  'miq.wizard',
  'miq.dashboardModule',
  'miq.containersModule',
  'miq.infrastructureModule',
  'miq.cloudsModule',
  'miq.eventsModule',
  'miq.applicationsModule',
  'miq.adminModule'
]).config(['$routeProvider', '$translateProvider',
  function ($routeProvider, $translateProvider) {
    'use strict';

    $routeProvider
      .when('/', {
        redirectTo: '/dashboard'
      })
      .when('/dashboard', {
        templateUrl: 'modules/containers/dashboard/dashboard.html',
        controller: 'containers.dashboardController'
      })
      .when('/applications', {
        templateUrl: 'modules/containers/dashboard/dashboard.html',
        controller: 'containers.dashboardController'
      })
      .when('/events', {
        templateUrl: 'modules/containers/dashboard/dashboard.html',
        controller: 'containers.dashboardController'
      })

      // Default
      .otherwise({
      });

    $translateProvider.translations('default', 'en');
    $translateProvider.preferredLanguage('default');
  }
]);
