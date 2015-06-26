'use strict';

angular.module('patternfly.navigation', []).directive('pfNavigation', ['$location', function(location) {
	var self = this;

	var navigationController = function($scope) {
		$scope.select = function(item, parent) {
		
			//Set its parent to be active too
			if (typeof(parent) !== "undefined") {
				clearActiveItems($scope);
				parent.class = "active";
			} else {
				clearActiveItems($scope);

				//Set the first child to be active if nothing is set
				if(item.children) {
					item.children[0].class = "active";
				}
			}
			//Set the child to be active
			item.class = "active";
		}
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
			var updatedRoute = "#" + location.path();

			$scope.items.forEach(function (topLevel) {
				if (topLevel.children) {	
					topLevel.children.forEach(function (secondLevel) {
						if (secondLevel.href === updatedRoute) {
							secondLevel.class="active";
							topLevel.class="active";
						}
					});
				} 
			});

		},
		controller: navigationController
	};
}]);

