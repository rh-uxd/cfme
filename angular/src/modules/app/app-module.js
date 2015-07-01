angular.module( 'cfme.appModule', [
    'ngResource',
    'ngRoute',
    'ui.bootstrap',
    'patternfly.navigation',
    'patternfly.pf-mixins',
    'patternfly.pf-components',
    'pascalprecht.translate',
    'cfme.containersModule',
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
