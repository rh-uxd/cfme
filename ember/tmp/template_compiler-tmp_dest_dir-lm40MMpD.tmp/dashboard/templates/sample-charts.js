export default Ember.HTMLBars.template((function() {
  return {
    isHTMLBars: true,
    revision: "Ember@1.12.0",
    blockParams: 0,
    cachedFragment: null,
    hasRendered: false,
    build: function build(dom) {
      var el0 = dom.createDocumentFragment();
      var el1 = dom.createElement("h2");
      var el2 = dom.createTextNode("Sample Charts");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n\n");
      dom.appendChild(el0, el1);
      var el1 = dom.createElement("div");
      dom.setAttribute(el1,"class","row");
      dom.setAttribute(el1,"style","background-color:#d0d0d0; padding-top: 10px;");
      var el2 = dom.createTextNode("\n    ");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","col-md-3");
      var el3 = dom.createTextNode("\n        ");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("div");
      dom.setAttribute(el3,"style","background-color: #ffffff");
      var el4 = dom.createTextNode("\n          ");
      dom.appendChild(el3, el4);
      var el4 = dom.createComment("");
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n        ");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n    ");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n    ");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","col-md-3");
      var el3 = dom.createTextNode("\n      ");
      dom.appendChild(el2, el3);
      var el3 = dom.createComment("");
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n    ");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n    ");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","col-md-2");
      var el3 = dom.createTextNode("\n      ");
      dom.appendChild(el2, el3);
      var el3 = dom.createComment("");
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n    ");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n    ");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","col-md-2");
      var el3 = dom.createTextNode("\n      ");
      dom.appendChild(el2, el3);
      var el3 = dom.createComment("");
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n    ");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n    ");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","col-md-2");
      var el3 = dom.createTextNode("\n      ");
      dom.appendChild(el2, el3);
      var el3 = dom.createComment("");
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n    ");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n    ");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","col-md-2");
      var el3 = dom.createTextNode("\n      ");
      dom.appendChild(el2, el3);
      var el3 = dom.createComment("");
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n    ");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n\n");
      dom.appendChild(el0, el1);
      return el0;
    },
    render: function render(context, env, contextualElement) {
      var dom = env.dom;
      var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
      dom.detectNamespace(contextualElement);
      var fragment;
      if (env.useFragmentCache && dom.canClone) {
        if (this.cachedFragment === null) {
          fragment = this.build(dom);
          if (this.hasRendered) {
            this.cachedFragment = fragment;
          } else {
            this.hasRendered = true;
          }
        }
        if (this.cachedFragment) {
          fragment = dom.cloneNode(this.cachedFragment, true);
        }
      } else {
        fragment = this.build(dom);
      }
      var element0 = dom.childAt(fragment, [2]);
      var morph0 = dom.createMorphAt(dom.childAt(element0, [1, 1]),1,1);
      var morph1 = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
      var morph2 = dom.createMorphAt(dom.childAt(element0, [5]),1,1);
      var morph3 = dom.createMorphAt(dom.childAt(element0, [7]),1,1);
      var morph4 = dom.createMorphAt(dom.childAt(element0, [9]),1,1);
      var morph5 = dom.createMorphAt(dom.childAt(element0, [11]),1,1);
      inline(env, morph0, context, "c3-chart", [], {"data": get(env, context, "model.sampleChartData")});
      inline(env, morph1, context, "utilization-chart", [], {"title": "CPU", "used": get(env, context, "model.cpuUsage.used"), "total": get(env, context, "model.cpuUsage.total"), "totalUnits": "MHz", "usageData": get(env, context, "model.cpuUsage.data")});
      inline(env, morph2, context, "aggregate-status-chart", [], {"aggregateType": "Nodes", "aggregateCount": get(env, context, "model.nodes.count"), "errorCount": get(env, context, "model.nodes.errorCount"), "aggregateTypeIconClass": "pficon-container-node"});
      inline(env, morph3, context, "aggregate-status-chart", [], {"aggregateType": "Pods", "aggregateCount": get(env, context, "model.pods.count"), "errorCount": get(env, context, "model.pods.errorCount"), "aggregateTypeIconClass": "fa-cubes"});
      inline(env, morph4, context, "object-status-chart", [], {"objectType": "Containers", "objectCount": get(env, context, "model.containers.count"), "typeIconClass": "fa-cube"});
      inline(env, morph5, context, "object-status-chart", [], {"objectType": "Services", "objectCount": get(env, context, "model.services.count"), "typeIconClass": "pficon-service"});
      return fragment;
    }
  };
}()));