import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    provider_type: 'openshift'
  },
  providerType: '',

  model: function model(params) {
    this.providerType = params.provider_type;
    var url = window.location.protocol + '//' + window.location.hostname + ':' + 3200;
    url = url + '/' + this.providerType + 'Providers';
    return Ember.$.getJSON(url);
  },

  setupController: function setupController(controller, model) {

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

  handleActivate: (function () {
    this.navbarNotificationService.setActiveItem('containersProvidersNavItem');
  }).on('activate'),

  randomInt: function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  nodeObjectId: 0,

  getUsedValue: function getUsedValue(total) {
    var used;

    var bucketPercent = this.randomInt(0, 100);
    if (bucketPercent < 65) {
      used = Math.floor(this.randomInt(20, total * 0.70));
    } else if (bucketPercent < 85) {
      used = Math.floor(this.randomInt(total * 0.70, total * 0.80));
    } else if (bucketPercent < 95) {
      used = Math.floor(this.randomInt(total * 0.80, total * 0.90));
    } else {
      used = Math.floor(this.randomInt(total * 0.90, total));
    }

    return used;
  },

  randomizeData: function randomizeData(count) {
    var newData = [];

    for (var i = 0; i < count; i++) {
      var total = 100;
      var used = this.getUsedValue(total);
      var available = total - used;
      var value = used / total;
      var valuePercent = Math.floor(value * 100);

      newData[i] = {
        id: this.incrementProperty('nodeObjectId'),
        value: value,
        tooltip: ['Node ' + i + ' : My ' + this.providerType + ' Provider', valuePercent + '% : ' + used + ' Used of ' + total + ' Total', available + ' Available'].join('<br/>')
      };
    }

    newData.sort(function (a, b) {
      return b.value - a.value;
    });

    return newData;
  }
});