define('dashboard/routes/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({

    model: function model() {
      var url = window.location.protocol + "//" + window.location.hostname + ":" + 3200;
      url = url + "/containers";
      return Ember['default'].$.getJSON(url);
    },

    setupController: function setupController(controller, model) {

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

      controller.set("model", model);
    },

    handleActivate: (function () {
      this.navbarNotificationService.setActiveItem("containersDashboardNavItem");
    }).on("activate"),

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

    randomizeData: function randomizeData(openShiftCount, kubernetesCount) {
      var newData = [];

      for (var i = 0; i < openShiftCount; i++) {
        var _total = 100;
        var used = this.getUsedValue(_total);
        var available = _total - used;
        var value = used / _total;
        var valuePercent = Math.floor(value * 100);

        newData.pushObject({
          id: this.incrementProperty("nodeObjectId"),
          value: value,
          tooltip: ["Node " + i + " : My OpenShift Provider", valuePercent + "% : " + used + " Used of " + _total + " Total", available + " Available"].join("<br/>")
        });
      }

      for (var k = 0; k < kubernetesCount; k++) {
        var total = 100;
        var used = this.getUsedValue(total);
        var available = total - used;
        var value = used / total;
        var valuePercent = Math.floor(value * 100);

        newData.pushObject({
          id: this.incrementProperty("nodeObjectId"),
          value: value,
          tooltip: ["Node " + k + " : My Kubernetes Provider", valuePercent + "% : " + used + " Used of " + total + " Total", available + " Available"].join("<br/>")
        });
      }

      newData.sort(function (a, b) {
        return b.value - a.value;
      });

      return newData;
    }
  });

});