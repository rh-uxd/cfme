'use strict';

angular.module('miq.appModule').controller( 'miq.appController', ['$scope', '$rootScope', '$resource',
  function( $scope, $rootScope, $resource ) {
    $scope.username = 'Administrator';

    //Navigation should be loaded from a service
    $scope.navigationItems = [];
    var Navigation = $resource('/navigation');
    Navigation.get(function(data) {
      $scope.navigationItems = data.data;
    });

    $scope.notifications = [
      {
        'text': 'Modified Datasources ExampleDS'
      },
      {
        'text': 'Error: System Failure'
      }
    ];

    $scope.clearNotifications = function() {
      $scope.notifications = [];
    };

  }
]);
