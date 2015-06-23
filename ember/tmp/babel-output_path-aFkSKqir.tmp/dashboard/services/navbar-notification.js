import Ember from 'ember';

export default Ember.Object.extend(Ember.Evented, {
  _currentNavbarSelection: 'containersDashboardNavItem',

  _initNavbarHandler: (function () {
    this._currentNavbarSelection = 'containersDashboardNavItem';
  }).on('init'),

  setActiveItem: function setActiveItem(elementId) {
    var self = this;
    Ember.run.later(function () {
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