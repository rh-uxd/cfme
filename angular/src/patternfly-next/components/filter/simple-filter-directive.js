angular.module('patternfly-next.components').directive('pfSimpleFilter', ['$document',
  function($document){
    'use strict';
    return {
      restrict: 'A',
      scope: {
        config: '='
      },
      replace: true,
      transclude: false,
      templateUrl: 'patternfly-next/components/filter/simple-filter.html',
      controller: ['$scope',
        function ($scope) {
          var defaultConfig = {
            fields: [],
            appliedFilters: [],
            resultsCount: 0,
            onFilterChange: undefined,
            currentValue: null
          };
          $scope.setupConfig = function() {
            $scope.config = $.extend(true, angular.copy(defaultConfig), $scope.config);

            if (!$scope.currentField) {
              $scope.currentField = $scope.config.fields[0];
              $scope.config.currentValue = null;
            }

            if (!$scope.config.appliedFilters) {
              $scope.config.appliedFilters = [];
            }
          };
        }
      ],
      link: function (scope, element, attrs) {
        attrs.$observe('config', function () {
          scope.setupConfig();
        }, true);

        scope.selectField = function(item) {
          scope.currentField = item;
          scope.config.currentValue = null;
        };

        scope.selectValue = function (filterValue) {
          scope.addFilter(scope.currentField, filterValue);
          scope.config.currentValue = null;
        };

        var filterExists = function (filter) {
          var found = false;
          scope.config.appliedFilters.forEach(function (nextFilter) {
            if (nextFilter.title === filter.title && nextFilter.value === filter.value) {
              found = true;
              return found;
            }
          });
          return found;
        };

        scope.addFilter = function (field, value) {
          var newFilter = {
            id: field.id,
            title: field.title,
            value: value
          };
          if (!filterExists(newFilter)) {
            scope.config.appliedFilters.push(newFilter);

            if (scope.config.onFilterChange)
            {
              scope.config.onFilterChange(scope.config.appliedFilters);
            }
          }
        };

        scope.onValueKeyPress = function(keyEvent) {
          if (keyEvent.which === 13) {
            scope.addFilter(scope.currentField, scope.config.currentValue);
            scope.config.currentValue = undefined;
          }
        };

        scope.clearFilter = function(item) {
          var newFilters = [];
          scope.config.appliedFilters.forEach(function (filter) {
            if (item.title !== filter.title || item.value !== filter.value) {
              newFilters.push(filter);
            }
          });
          scope.config.appliedFilters = newFilters;

          if (scope.config.onFilterChange)
          {
            scope.config.onFilterChange(scope.config.appliedFilters);
          }
        };

        scope.clearAllFilters = function() {
          scope.config.appliedFilters = [];

          if (scope.config.onFilterChange)
          {
            scope.config.onFilterChange(scope.config.appliedFilters);
          }
        };
      }
    }
  }
]);
