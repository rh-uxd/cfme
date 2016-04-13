angular.module('miq.wizard').directive('miqWizardSubstep', function() {
  return {
    restrict: 'A',
    replace: true,
    transclude: true,
    scope: {
      stepTitle: '@',
      stepId: '@',
      nextEnabled: '=?',
      disabled: '@?wzDisabled',
      description: '@',
      wizardData: '=',
      onShow: '=?',
      showReviewDetails: '@?',
      reviewTemplate: '@?'
    },
    require: '^miq-wizard-step',
    templateUrl: 'modules/app/directives/wizard/wizard-substep.html',
    controller: function($scope) {
      if (angular.isUndefined($scope.nextEnabled)) {
        $scope.nextEnabled = true;
      }
      if (angular.isUndefined($scope.showReviewDetails)) {
        $scope.showReviewDetails = false;
      }
    },
    link: function($scope, $element, $attrs, step) {
      $scope.title = $scope.stepTitle;
      step.addStep($scope);
    }
  };
});
