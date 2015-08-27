angular.module( 'cfme.appModule', [
    'ngResource',
    'ngRoute',
    'ui.bootstrap',
    'pascalprecht.translate',
    'patternfly',
    'patternfly.views',
    'patternfly.utils',
    'cfme.patternfly.card',
    'patternfly.charts',
    'cfme.services',
    'cfme.charts',
    'cfme.navigation',
    'cfme.containersModule',
    'cfme.card',
    'cfme.charts'
] )
    .config( ['$routeProvider', '$translateProvider',
              function( $routeProvider, $translateProvider ) {
                  'use strict';

                  $routeProvider
                  .when('/', {
                    redirectTo: '/containers/dashboard'
                  })

                  // Default
                  .otherwise({
                    redirectTo: '/'
                  });

                  $translateProvider.translations( 'default', 'en');
                  $translateProvider.preferredLanguage( 'default' );

              }
    ] );
