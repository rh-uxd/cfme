angular.module( 'miq.appModule', [
  'ngResource',
  'ngRoute',
  'ui.bootstrap',
  'pascalprecht.translate',
  'patternfly',
  'patternfly.charts',
  'miq.util',
  'miq.charts',
  'miq.card',
  'miq.navigation',
  'miq.containersModule',
  'miq.infrastructureModule'
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
        });

      $translateProvider.translations( 'default', 'en');
      $translateProvider.preferredLanguage( 'default' );

    }
  ]
);
