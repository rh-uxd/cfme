import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    id: 1
  },
  providerName: '',

  model: function (params) {
    var url = window.location.protocol + "//" + window.location.hostname + ":" + 3200;
    var id = params.id;
    if (id > 0) {
      url = url + '/projects' + "/" + params.id;
    }
    else {
      // Default for now...
      url = url + '/projects' + "/1";
    }
    return Ember.$.getJSON(url);
  },

  setupController: function (controller, model) {

    this.providerName = model.provider.name;

    // FAKE NODE USAGE FOR NOW
    var numNodes = model.nodes.count;
    model.nodeCpuUsage = {
      data: this.randomizeData(numNodes)
    };
    model.nodeMemoryUsage = {
      data: this.randomizeData(numNodes)
    };
    model.nodeStorageUsage = {
      data: this.randomizeData(numNodes)
    };
    model.nodeNetworkUsage = {
      data: this.randomizeData(numNodes)
    };

    controller.set('model', model);
  },

  handleActivate: function() {
    this.navbarNotificationService.setActiveItem('containersProjectsNavItem');
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

  randomizeData: function (count) {
    var newData = [];

    for (let i = 0; i < count; i++) {
      let total = 100;
      let used = this.getUsedValue(total);
      let available = total - used;
      let value = used / total;
      let valuePercent = Math.floor(value * 100);

      newData[i] = {
        id: this.incrementProperty('nodeObjectId'),
        value,
        tooltip: [
          `Node ${i} : ${this.providerName}`,
          `${valuePercent}% : ${used} Used of ${total} Total`,
          `${available} Available`
        ].join('<br/>')
      };
    }

    newData.sort(function (a, b) {
      return b.value - a.value;
    });

    return newData;
  }
});
