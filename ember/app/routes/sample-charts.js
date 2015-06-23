import Ember from 'ember';

export default Ember.Route.extend({
  myModel: {
    sampleChartData: {
      columns: [
        ['data1', 30, 20, 50, 40, 60, 50],
        ['data2', 200, 130, 90, 240, 130, 220],
        ['data3', 300, 200, 160, 400, 250, 250],
        ['data4', 200, 130, 90, 240, 130, 220],
        ['data5', 130, 120, 150, 140, 160, 150],
        ['data6', 90, 70, 20, 50, 60, 120]
      ],
      type: 'bar',
      types: {
        data3: 'spline',
        data4: 'line',
        data6: 'area'
      },
      groups: [
        ['data1', 'data2']
      ]
    },
    cpuUsage: {
      used: 950,
      total: 1000,
      data: [712, 725, 729, 710, 740, 742, 750]
    },
    nodes: {
      count: 52,
      errorCount: 3
    },
    pods: {
      count: 1200,
      errorCount: 35
    },
    containers: {
      count: 300
    },
    services: {
      count: 2500
    }
  },

  model: function () {
    return this.myModel;
  },

  setupController: function(controller, model) {
    controller.set('model', model);
  }

});
