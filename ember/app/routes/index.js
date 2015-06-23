import Ember from 'ember';

export default Ember.Route.extend({

  model: function () {
    var url = window.location.protocol + "//" + window.location.hostname + ":" + 3200;
    url = url + '/containers';
    return Ember.$.getJSON(url);
  },

  setupController: function (controller, model) {

    // FAKE NODE USAGE FOR NOW
    var openShiftCount = model.nodes.openShiftCount;
    var kubernetesCount = model.nodes.kubernetesCount;
    model.nodeCpuUsage = {
      data: this.randomizeData(openShiftCount, kubernetesCount)
    };
    model.nodeMemoryUsage = {
      data: this.randomizeData(openShiftCount, kubernetesCount)
    };
    model.nodeStorageUsage = {
      data: this.randomizeData(openShiftCount, kubernetesCount)
    };
    model.nodeNetworkUsage = {
      data: this.randomizeData(openShiftCount, kubernetesCount)
    };

    controller.set('model', model);
  },

  handleActivate: function() {
    this.navbarNotificationService.setActiveItem('containersDashboardNavItem');
  }.on('activate'),

  randomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  nodeObjectId: 0,

  getUsedValue: function(total) {
    var used;

    let bucketPercent = this.randomInt(0, 100);
    if (bucketPercent < 65) {
      used = Math.floor(this.randomInt(20, (total * 0.70)));
    }
    else if (bucketPercent < 85) {
      used = Math.floor(this.randomInt((total * 0.70), (total * 0.80)));
    }
    else if (bucketPercent < 95) {
      used = Math.floor(this.randomInt((total * 0.80), (total * 0.90)));
    }
    else {
      used = Math.floor(this.randomInt((total * 0.90), total));
    }

    return used;
  },

  randomizeData: function (openShiftCount, kubernetesCount) {
    var newData = [];

    for (let i = 0; i < openShiftCount; i++) {
      let total = 100;
      let used = this.getUsedValue(total);
      let available = total - used;
      let value = used / total;
      let valuePercent = Math.floor(value * 100);

      newData.pushObject({
        id: this.incrementProperty('nodeObjectId'),
        value,
        tooltip: [
          `Node ${i} : My OpenShift Provider`,
          `${valuePercent}% : ${used} Used of ${total} Total`,
          `${available} Available`
        ].join('<br/>')
      });
    }

    for (var k = 0; k < kubernetesCount; k++) {
      var total = 100;
      let used = this.getUsedValue(total);
      let available = total - used;
      let value = used / total;
      let valuePercent = Math.floor(value * 100);

      newData.pushObject({
        id: this.incrementProperty('nodeObjectId'),
        value,
        tooltip: [
          `Node ${k} : My Kubernetes Provider`,
          `${valuePercent}% : ${used} Used of ${total} Total`,
          `${available} Available`
        ].join('<br/>')
      });
    }

    newData.sort(function (a, b) {
      return b.value - a.value;
    });

    return newData;
  }
});
