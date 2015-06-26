
angular.module('patternfly.pf-components' ).directive('pfPercentageUsed', function() {
	'use strict';

    return {
        restrict: 'A',
        scope: {
        	charts: '=',
        },
        replace: true,
        templateUrl: 'modules/app/components/progress-chart.html',
    };
});
