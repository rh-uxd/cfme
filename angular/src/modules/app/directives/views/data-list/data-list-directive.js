angular.module('cfme.views').directive('cfmeDataList', ['CfmeEventBus',
function(eventBus) {
    'use strict';
    return {
        restrict: 'A',
        scope: {
            config: '=?',
            items: '=',
            eventId: '@id'
        },
        replace: true,
        transclude: true,
        templateUrl: 'modules/app/directives/views/data-list/data-list.html',
        controller: ['$scope',
            function($scope) {
                $scope.defaultConfig = {
                    selectItems: false,
                    multiSelect: false,
                    selectionMatchProp: 'uuid',
                    selectedItems: [],
                    checkDisabled: false,
                    showSelectBox: true,
                    showActionMenus: true,
                    rowHeight: 30
                };

                $scope.eventSignature = 'cfme:data-list';
                if($scope.eventId) {
                    $scope.eventSignature = $scope.eventSignature + ':' + $scope.eventId;
                }

                var init = function(config) {
                    $scope.config = $.extend(true, angular.copy($scope.defaultConfig), $scope.config);
                };

                init($scope.config);
            }
        ],

        link: function(scope, element, attrs) {
            attrs.$observe('config', function() {
                scope.config = $.extend(true, angular.copy(scope.defaultConfig), scope.config);
            });

            scope.itemClick = function(e, item){
                if (scope.config && scope.config.selectItems && item){
                    if (scope.config.multiSelect && !scope.config.dblClick){
                        var selectMatch = _.find(scope.config.selectedItems, function(itemObj){return itemObj === item;});
                        if (selectMatch) {
                            scope.config.selectedItems = _.without(scope.config.selectedItems, selectMatch);
                        }
                        else {
                            scope.config.selectedItems.push(item);
                        }
                    }
                    else {
                        if (scope.config.selectedItems[0] === item) {
                            if (!scope.config.dblClick) {
                                scope.config.selectedItems = [];
                            }
                            return false;
                        }
                        scope.config.selectedItems = [item];
                    }
                    eventBus.emit(scope.eventSignature + ':select', item, e);
                }
                eventBus.emit(scope.eventSignature + ':click', item, e);
            };

            scope.dblClick = function(e, item) {
                eventBus.emit(scope.eventSignature + ':dblClick', item, e);
            };

            scope.selectionChange = function(item) {
                eventBus.emit(scope.eventSignature + ':selection-change', item);
            };

            scope.isSelected = function(item){
                var matchProp = scope.config.selectionMatchProp;
                if (scope.config.selectedItems.length) {
                    return _.find(scope.config.selectedItems, function(itemObj){return itemObj[matchProp] === item[matchProp]; });
                }
                return false;
            };

            scope.showMenu = function(item) {
                console.log("Showing Menu");
            };
        }
    };
}]);
