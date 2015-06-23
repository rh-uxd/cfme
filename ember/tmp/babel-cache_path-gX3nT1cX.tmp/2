import Ember from 'ember';

export default Ember.Component.extend({
  breadCrumbs: [],
  navBarHeight: 105,
  navBarId: 'appNavBar',
  breadCrumbBarId: 'breadCrumbBar',
  topPosition: 0,
  topFudge: -3,

  didInsertElement: function didInsertElement() {
    var breadCrumbs = this.get('breadCrumbs');
    if (breadCrumbs && breadCrumbs.length > 0) {
      var self = this;
      Ember.run.later(function () {
        self.set('navBarHeight', $('#appNavBar').height());
        self.set('topPosition', self.get('navBarHeight') - self.get('topFudge'));
        self.set('breadCrumbBarHeight', $('#breadCrumbBar').height());

        var totalHeight = self.get('navBarHeight') + self.get('breadCrumbBarHeight') - self.get('topFudge');
        document.body.style.padding = totalHeight + 'px 0 0 0';
      }, 100);
    }
  },

  willDestroyElement: function willDestroyElement() {
    document.body.style.padding = this.get('navBarHeight') + 'px 0 0 0';
  }
});