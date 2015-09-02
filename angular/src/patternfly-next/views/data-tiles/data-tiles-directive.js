angular.module('patternfly-next.views').directive('pfDataTiles', [
  function () {
    'use strict';
    return {
      restrict: 'A',
      scope: {
        config: '=?',
        items: '=',
        eventId: '@id'
      },
      transclude: true,
      templateUrl: 'patternfly-next/views/data-tiles/data-tiles.html',
      controller: ['$scope',
        function ($scope) {
          $scope.defaultConfig = {
            selectItems: false,
            multiSelect: false,
            dblClick: false,
            selectionMatchProp: 'uuid',
            selectedItems: [],
            checkDisabled: false,
            showSelectBox: true,
            onSelect: null,
            onSelectionChange: null,
            onCheckBoxChange: null,
            onClick: null,
            onDblClick: null
          };

          $scope.config = $.extend(true, angular.copy($scope.defaultConfig), $scope.config);
        }
      ],

      link: function (scope, element, attrs) {
        attrs.$observe('config', function () {
          scope.config = $.extend(true, angular.copy(scope.defaultConfig), scope.config);
          if (!scope.config.selectItems) {
            scope.config.selectedItems = [];
          }
          if (!scope.config.multiSelect && scope.config.selectedItems && scope.config.selectedItems.length > 0) {
            scope.config.selectedItems = [scope.config.selectedItems[0]];
          }
        });

        scope.itemClick = function (e, item) {
          var alreadySelected;
          var selectionChanged = false;
          var continueEvent = true;

          // Ignore disabled item clicks completely
          if (scope.checkDisabled(item)) {
            return continueEvent;
          }

          if (scope.config && scope.config.selectItems && item) {
            if (scope.config.multiSelect && !scope.config.dblClick) {

              alreadySelected = _.find(scope.config.selectedItems, function (itemObj) {
                return itemObj === item;
              });

              if (alreadySelected) {
                // already selected so deselect
                scope.config.selectedItems = _.without(scope.config.selectedItems, item);
              } else {
                // add the item to the selected items
                scope.config.selectedItems.push(item);
                selectionChanged = true;
              }
            } else {
              if (scope.config.selectedItems[0] === item) {
                if (!scope.config.dblClick) {
                  scope.config.selectedItems = [];
                  selectionChanged = true;
                }
                continueEvent = false;
              } else {
                scope.config.selectedItems = [item];
                selectionChanged = true;
              }
            }

            if (selectionChanged && scope.config.onSelect) {
              scope.config.onSelect(item, e);
            }
            if (selectionChanged && scope.config.onSelectionChange) {
              scope.config.onSelectionChange(scope.config.selectedItems, e);
            }
          }
          if (scope.config.onClick) {
            scope.config.onClick(item, e);
          }

          return continueEvent;
        };

        scope.dblClick = function (e, item) {
          if (scope.config.onDblClick) {
            scope.config.onDblClick(item, e);
          }
        };

        scope.checkBoxChange = function (item) {
          if (scope.config.onCheckBoxChange) {
            scope.config.onCheckBoxChange(item);
          }
        };

        scope.isSelected = function (item) {
          var matchProp = scope.config.selectionMatchProp;
          if (scope.config.selectedItems.length) {
            return _.find(scope.config.selectedItems, function (itemObj) {
              return itemObj[matchProp] === item[matchProp];
            });
          }
          return false;
        };

        scope.checkDisabled = function (item) {
          return scope.config.checkDisabled && scope.config.checkDisabled(item);
        };
      }
    };
  }
]);
