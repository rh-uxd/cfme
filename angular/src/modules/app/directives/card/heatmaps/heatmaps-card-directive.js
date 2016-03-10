angular.module( 'miq.card' ).directive('heatmapsCard', ['ChartsDataMixin' ,function(chartsDataMixin) {
  'use strict';
  return {
    restrict: 'A',
    scope: {
      cardTitle: '@',
      heatmaps: '=',
      hidetopborder: '@',
      heatmapChartHeight: '=',
      columnSizingClass: '@',
      heatMapUsageLegendLabels: '=',
      chartDataAvailable: '=?'
    },
    templateUrl: 'modules/app/directives/card/heatmaps/heatmaps-card.html',
    controller: ['$scope', '$rootScope',
      function($scope, $rootScope) {
        if ($scope.columnSizingClass === undefined) {
          $scope.columnSizingClass = "col-xs-8 col-sm-6 col-md-6";
        }
        $scope.noLabels = [];

        $scope.setLegendStyles = function () {
          $scope.legendStyles = {
            visibility: $scope.chartDataAvailable ? 'visible' : 'hidden'
          };
        };

        $scope.setLegendStyles();
      }
    ],
    link: function(scope, element, attrs) {
      scope.$watch('chartDataAvailable', function() {
        scope.setLegendStyles();
      });
    }
  };
}]);
