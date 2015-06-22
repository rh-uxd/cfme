'use strict';

describe('Controller: appController', function () {

  // load the controller's module
  beforeEach(module('cfme.appModule'));

  var appController,
    vm;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    appController = $controller('appController', {
      $scope: scope
    });
  }));

  it('should attach a list of navigationItems', function () {
    expect(vm.navigationItems.length).toBe(3);
  });
});
