
angular.module('patternfly.pf-components' ).directive('pfPercentageUsed', function($timeout) {
	'use strict';

    return {
        restrict: 'A',
        scope: {
        	charts: '=',
        },
        replace: true,
        templateUrl: 'modules/app/components/progress-chart.html',
        link: function($scope) {
        	
        	angular.forEach($scope.charts, function(chart, index) {
  				chart.percentageUsed = 100 * (chart.start/chart.end);
			}, $scope.charts);

        	//Used for animating the chart load. May not be necessary once we have remote data
        	$scope.animate = true;
			$timeout(function(){
				$scope.animate = false;
            }, 0);
        }
    };
});
