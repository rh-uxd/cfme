angular.module('miq.charts').directive('objectList', function() {
  'use strict';
  return {
    restrict: 'A',
    scope: {
      columns: '=?',
      items: '=',
      listConfig: '=',
      listId: '@',
      listClass: '@'
    },
    templateUrl: 'modules/app/directives/lists/object-list.html',
    controller: ['$scope',
      function ($scope) {
        if (($scope.columns !== undefined) && ($scope.listConfig.columns === undefined))
        {
          $scope.listConfig.columns = $scope.columns;
        }
      }
    ]
  }
});
