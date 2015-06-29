'use strict';

angular.module('patternfly.navigation', []).directive('pfNavigation', ['$location', '$rootScope', function(location, rootScope) {

	var navigationController = function($scope) {

		rootScope.$on( "$routeChangeSuccess", function(event, next, current) {
 			
			clearActiveItems($scope);

 			var updatedRoute = "#" + location.path();

			//Setting active state on load
			$scope.items.forEach(function (topLevel) {
				if (topLevel.children) {	
					topLevel.children.forEach(function (secondLevel) {
						if (updatedRoute.indexOf(secondLevel.href) > -1) {
							secondLevel.class="active";
							topLevel.class="active";
						}
					});
				} 
			});

		});
	};

	var clearActiveItems = function($scope) {
		$scope.items.forEach(function eachItem(item) {
			if (item.children) {
				item.class = "";
				item.children.forEach(eachItem);
			} else {
				item.class = "";
			}
		});
	};

	return {
		restrict: 'A',
		scope: {
			items: '='
		},
		replace: true,
		templateUrl: 'modules/app/directives/templates/navigation.html',
		
		link: function($scope) {
			//wrapping this in a watcher to make sure state is set correctly
			$scope.$watch('items', function(newVal, oldVal){
				if (oldVal.length === 0) {
					var updatedRoute = "#" + location.path();
					//Setting active state on load
					$scope.items.forEach(function (topLevel) {
						if (topLevel.children) {	
							topLevel.children.forEach(function (secondLevel) {
								if (updatedRoute.indexOf(secondLevel.href) > -1) {
									secondLevel.class="active";
									topLevel.class="active";
								}
							});
						} 
					});
				}	
			}, true);
		},
		controller: navigationController
	};
}]);

