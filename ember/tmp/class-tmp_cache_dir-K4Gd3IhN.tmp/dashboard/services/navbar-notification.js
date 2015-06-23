define('dashboard/services/navbar-notification', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Object.extend(Ember['default'].Evented, {
    _currentNavbarSelection: 'containersDashboardNavItem',

    _initNavbarHandler: (function () {
      this._currentNavbarSelection = 'containersDashboardNavItem';
    }).on('init'),

    setActiveItem: function setActiveItem(elementId) {
      var self = this;
      Ember['default'].run.later(function () {
        var currentElement = $('#' + self._currentNavbarSelection);
        var newElement = $('#' + elementId);

        if (currentElement) {
          currentElement.removeClass('active');
        }
        if (newElement) {
          newElement.addClass('active');
        }
        self._currentNavbarSelection = elementId;
      }, 100);
    }
  });

});