angular.module('miq.charts').directive('listColumns', function() {
  'use strict';
  return {
    restrict: 'A',
    scope: {
      columns: '=',
      item: '='
    },
    replace: true,
    templateUrl: 'modules/app/directives/lists/list-columns.html',
    controller: ['$scope',
      function($scope) {
        $scope.getColumnStyle = function (column, index) {
          var styleString = '';
          if (column.width !== undefined) {
            styleString += 'width: ' + column.width + 'px;';
          }
          if (index === 0) {
            styleString += 'padding-left: 25px;';
          }
          return styleString;
        };
      }
    ]
  };
});
