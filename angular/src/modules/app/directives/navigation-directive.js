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
		},
		controller: function($scope) {

			$scope.select = function(item, parent) {
				//Set its parent to be active too
				if (typeof(parent) !== "undefined") {
					clearActiveItems(parent);
					parent.class = "active";
				} else {
					clearActiveItems(item);

					//Set the first child to be active if nothing is set
					if(item.children) {
						item.children[0].class = "active";
					}
				}
				//Set the child to be active
				item.class = "active";
			}


			function clearActiveItems() {
				//Iterate and clear anything that is selected
				$scope.items.forEach(function eachItem(item) {
					if (item.children) {
						item.class = "";
						item.children.forEach(eachItem);
					} else {
						item.class = "";
					}
				});
			}

		}
	};
});

