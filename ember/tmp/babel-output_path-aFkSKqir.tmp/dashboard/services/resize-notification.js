import Ember from 'ember';

export default Ember.Object.extend(Ember.Evented, {
  _oldWindowWidth: null,
  _oldWindowHeight: null,

  _initResizeHandler: (function () {
    var self = this;
    Ember.$(window).on('resize', function () {
      self._triggerResizeListenersLowLatency();
      Ember.run.debounce(self, self._triggerResizeListeners, 100);
    });
  }).on('init'),

  _triggerResizeListenersLowLatency: function _triggerResizeListenersLowLatency() {
    var self = this;
    var width = window.innerWidth;
    var height = window.innerHeight;
    if (width !== self.get('_oldWindowWidth') || height !== self.get('_oldWindowHeight')) {
      self.set('_oldWindowWidth', width);
      self.set('_oldWindowHeight', height);
      self.trigger('windowResizedLowLatency');
    }
  },

  _triggerResizeListeners: function _triggerResizeListeners() {
    var self = this;
    var width = window.innerWidth;
    var height = window.innerHeight;
    if (width !== self.get('_oldWindowWidth') || height !== self.get('_oldWindowHeight')) {
      self.set('_oldWindowWidth', width);
      self.set('_oldWindowHeight', height);
      self.trigger('windowResized');
    }
  }

});
/* event */