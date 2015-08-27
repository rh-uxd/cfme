
angular
  .module('patternfly.utils').directive('pfTransclude', function () {
    'use strict';
    return {
      restrict: 'A',
      link: function ($scope, $element, $attrs, controller, $transclude) {
        var iChildScope;
        var iScopeType;
        if (!$transclude) {
          throw new Error('pfTransclude - ' +
          'Illegal use of pfTransclude directive in the template! ' +
          'No parent directive that requires a transclusion found. ' +
          'Element: {0}');
        }

        iScopeType = $attrs.pfTransclude || 'sibling';

        switch (iScopeType) {
        case 'sibling':
          $transclude(function (clone) {
            $element.empty();
            $element.append(clone);
          });
          break;
        case 'parent':
          $transclude($scope, function (clone) {
            $element.empty();
            $element.append( clone );
          });
          break;
        case 'child':
          iChildScope = $scope.$new();
          $transclude( iChildScope, function (clone) {
            $element.empty();
            $element.append( clone );
            $element.on( '$destroy', function () {
              iChildScope.$destroy();
            });
          });
          break;
        }
      }
    };
  });
