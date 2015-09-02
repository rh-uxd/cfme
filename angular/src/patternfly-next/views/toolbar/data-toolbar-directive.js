angular.module('patternfly-next.views').directive('pfDataToolbar', ['$document',
  function($document){
    'use strict';
    return {
      restrict: 'A',
      scope: {
        config: '='
      },
      replace: true,
      transclude: false,
      templateUrl: 'patternfly-next/views/toolbar/data-toolbar.html',

      controller: function ($scope) {
        $scope.filterDomId = $scope.config && $scope.config.filterId ? 'data-filter-' + $scope.config.filterId : 'data-filter';
        $scope.sorterDomId = $scope.config && $scope.config.sorterId ? 'data-sorter-' + $scope.config.sorterId : 'data-sorter';
      },

      link: function (scope, element, attrs) {
        var defaultConfig = {
          totalCount: null,
          countLabel: 'items',
          title: ''
        };

        attrs.$observe('config', function () {
          scope.config = $.extend(true, angular.copy(defaultConfig), scope.config);
          if (scope.config.viewsConfig.views) {
            scope.config.viewsConfig.viewsList = angular.copy(scope.config.viewsConfig.views);

            if (scope.config.viewsConfig.currentView) {
              scope.config.viewsConfig.currentView = scope.config.viewsConfig.viewsList[0];
            }
          }
        });

        scope.viewSelected = function (view) {
          if (scope.config.viewsConfig.onViewSelect && !scope.checkViewDisabled(view)) {
            scope.config.viewsConfig.currentView = view;
            scope.config.viewsConfig.onViewSelect(view);
          }
        };

        scope.isViewSelected = function (view) {
          return scope.config.viewsConfig.currentView === view;
        };

        scope.checkViewDisabled = function (view) {
          return scope.config.viewsConfig.checkViewDisabled && scope.config.viewsConfig.checkViewDisabled(view);
        };
      }
    };
  }
]);
