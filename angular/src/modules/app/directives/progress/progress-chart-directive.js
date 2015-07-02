
angular.module('patternfly.pf-components' ).directive('pfPercentageUsed', function($timeout) {
	'use strict';

    return {
        restrict: 'A',
        scope: {
        	charts: '=',
        },
        replace: true,
        templateUrl: 'modules/app/directives/progress/progress-chart.html',
        link: function($scope) {
        	
            $scope.$watch('charts', function(newVal, oldVal){

                if (typeof(newVal) !== "undefined") {

        	       angular.forEach($scope.charts, function(chart, index) {
  				      chart.percentageUsed = 100 * (chart.start/chart.end);
			         }, $scope.charts);

        	       //Used for animating the chart load.
        	       $scope.animate = true;
			         $timeout(function(){
				        $scope.animate = false;
                    }, 0);
                }
            });
        }
    };
});
