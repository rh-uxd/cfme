angular.module('miq.charts')
    .directive('percentageUsed', ['$timeout', function($timeout) {
    'use strict';

  return {
    restrict: 'A',
    scope: {
      charts: '='
    },
    replace: true,
    templateUrl: 'modules/app/directives/charts/progress/progress-chart.html',
    link: function($scope) {
      $scope.$watch('charts', function(newVal, oldVal){
        if (typeof(newVal) !== 'undefined') {
          //Calculate the percentage used
          angular.forEach($scope.charts, function(chart, index) {
            chart.percentageUsed = Math.round(100 * (chart.start/chart.end));
            chart.usedTooltip = chart.percentageUsed + "%: " + chart.start + " of " + chart.end;
            chart.availableTooltip = (100 - chart.percentageUsed) + "%: " + (chart.end - chart.start) + " of " + chart.end;
          }, $scope.charts);

          //Animate in the chart load.
          $scope.animate = true;
              $timeout(function(){
                $scope.animate = false;
              }, 0);
        }
      }, true);
      $timeout(function() {
        $('[data-toggle="tooltip"]').tooltip();
      }, 100);

    }
  };
}]);
