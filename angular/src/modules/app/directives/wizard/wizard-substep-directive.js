angular.module('miq.wizard').directive('miqWizardSubstep', function() {
  return {
    restrict: 'A',
    replace: true,
    transclude: true,
    scope: {
      stepTitle: '@',
      canenter : '=',
      canexit : '=',
      disabled: '@?wzDisabled',
      description: '@',
      wizardData: '='
    },
    require: '^miq-wizard-step',
    templateUrl: 'modules/app/directives/wizard/wizard-substep.html',
    link: function($scope, $element, $attrs, step) {
      $scope.title = $scope.stepTitle;
      step.addSubstep($scope);
    }
  };
});
