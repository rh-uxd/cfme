angular.module('miq.dialogs').directive('miqModal', function () {
  'use strict';
  return {
    restrict: 'A',
    transclude: true,
    replace: true,
    scope: {
      visible: '=',
      modalTitle: '@',
      modalSize: '@',
      onShow: '&',
      onHide: '&',
      onCancel: '&'
    },
    templateUrl: 'modules/app/directives/dialogs/modal-dialog.html',
    link: function (scope, element) {
      scope.$watch('visible', function(value) {
        if (value == true) {
          $(element).modal('show');
        } else {
          $(element).modal('hide');
        }
      });

      $(element).on('shown.bs.modal', function() {
        if (scope.onShow) {
          scope.$apply(function () {
            scope.onShow();
          });
        }
      });

      $(element).on('hidden.bs.modal', function(e) {
        if (scope.onHide) {
          scope.$apply(function () {
            scope.onHide();
          });
        }
        e.stopImmediatePropagation();
      });
    }
  };
});
angular.module('miq.dialogs').directive('autoFocus', function ($timeout) {
  return {
    restrict: 'AC',
    link: function(scope, element, attrs) {
      $timeout(function (){
        element[0].focus();
      }, 0);
      scope.$watch(attrs.autoFocus, function(value) {
        if (value === true) {
          $timeout(function() {
            element[0].focus();
          }, 200);
        }
      });
    }
  };
});
angular.module('miq.dialogs').directive('ngEnter', function() {
  return function(scope, element, attrs) {
    element.bind("keydown keypress", function(event) {
      if (event.which === 13) {
        scope.$apply(function() {
          scope.$eval(attrs.ngEnter, {'event': event});
        });
        event.preventDefault();
      }
    });
  };
});
