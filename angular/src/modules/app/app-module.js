angular.module( 'cfme.appModule', [
    'ngResource',
    'ngRoute',
    'ui.bootstrap',
    'angular-c3',
    'patternfly.navigation',
    'patternfly.pf-components',
    'pascalprecht.translate',
    'cfme.dashboardModule',
] )
    .config( ['$routeProvider', '$translateProvider',
              function( $routeProvider, $translateProvider ) {
                  'use strict';

                  $routeProvider
                  .when('/', {
                    redirectTo: '/containers/dashboard'
                  })
                  .when('/containers/dashboard', {
                    templateUrl: 'modules/dashboard/views/dashboard.html',
                    controller: 'dashboardController',
                    controllerAs: 'vm'
                  })
                  .when('/containers/projects', {
                    templateUrl: 'modules/dashboard/views/dashboard.html',
                    controller: 'dashboardController',
                    controllerAs: 'vm'
                  })
                  .when('/containers/providers', {
                    templateUrl: 'modules/dashboard/views/dashboard.html',
                    controller: 'dashboardController',
                    controllerAs: 'vm'
                  })
                  // Default
                  .otherwise({
                    redirectTo: '/todo'
                  });

                  $translateProvider.translations( 'default', 'en');
                  $translateProvider.preferredLanguage( 'default' );

              }
    ] );
