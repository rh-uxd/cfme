angular.module( 'cfme.appModule', [
    'ngResource',
    'ngRoute',
    'ui.bootstrap',
    'pascalprecht.translate',
    'patternfly.navigation',
    'patternfly.pf-mixins',
    'patternfly.pf-components',
    'cfme.containersModule'
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
