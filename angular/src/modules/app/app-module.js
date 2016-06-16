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
        templateUrl: 'modules/dashboard/dashboard.html'
      })

      // Default
      .otherwise({
      });

    $translateProvider.translations('default', 'en');
    $translateProvider.preferredLanguage('default');
  }
]);
