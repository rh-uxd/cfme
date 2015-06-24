'use strict';

angular.module('patternfly.navigation', []).directive('pfNavigation', function() {
	return {
		restrict: 'A',
		scope: {
			items: '='
		},
		replace: true,
		templateUrl: 'modules/app/directives/templates/navigation.html',
		link: function($scope){
			console.log('items:' + $scope.items);
		}
	};
});

