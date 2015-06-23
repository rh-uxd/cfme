export default Ember.HTMLBars.template((function() {
  return {
    isHTMLBars: true,
    revision: "Ember@1.12.0",
    blockParams: 0,
    cachedFragment: null,
    hasRendered: false,
    build: function build(dom) {
      var el0 = dom.createDocumentFragment();
      var el1 = dom.createElement("div");
      dom.setAttribute(el1,"class","utilization-chart");
      var el2 = dom.createTextNode("\n  ");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("h3");
      dom.setAttribute(el2,"class","h4 count-title");
      var el3 = dom.createComment("");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n  ");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","count-utilization flex-horizontal-container");
      var el3 = dom.createTextNode("\n      ");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("span");
      var el4 = dom.createComment("");
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode(" ");
      dom.appendChild(el3, el4);
      var el4 = dom.createComment("");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n      ");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("div");
      dom.setAttribute(el3,"class","available-text flex-vertical-container");
      var el4 = dom.createTextNode("\n          ");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("span");
      dom.setAttribute(el4,"class","title-small title-small-upper");
      var el5 = dom.createTextNode("Available");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n          ");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("span");
      dom.setAttribute(el4,"class","title-small title-small-lower");
      var el5 = dom.createTextNode(" of ");
      dom.appendChild(el4, el5);
      var el5 = dom.createComment("");
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode(" ");
      dom.appendChild(el4, el5);
      var el5 = dom.createComment("");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n      ");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n  ");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n  ");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"id","radial-chart-containter");
      dom.setAttribute(el2,"class","radial-chart flex-horizontal-container");
      var el3 = dom.createTextNode("\n      ");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("div");
      dom.setAttribute(el3,"class","flex-one");
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n      ");
      dom.appendChild(el2, el3);
      var el3 = dom.createComment("");
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n      ");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("div");
      dom.setAttribute(el3,"class","flex-one");
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n  ");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n  ");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"id","sparklineChart");
      var el3 = dom.createTextNode("\n    ");
      dom.appendChild(el2, el3);
      var el3 = dom.createComment("");
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n  ");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n  ");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("p");
      dom.setAttribute(el2,"class","pull-left legend-text");
      var el3 = dom.createComment("");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n");
      dom.appendChild(el0, el1);
      return el0;
    },
    render: function render(context, env, contextualElement) {
      var dom = env.dom;
      var hooks = env.hooks, content = hooks.content, get = hooks.get, inline = hooks.inline;
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
      var element0 = dom.childAt(fragment, [0]);
      var element1 = dom.childAt(element0, [3]);
      var element2 = dom.childAt(element1, [1]);
      var element3 = dom.childAt(element1, [3, 3]);
      var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),0,0);
      var morph1 = dom.createMorphAt(element2,0,0);
      var morph2 = dom.createMorphAt(element2,2,2);
      var morph3 = dom.createMorphAt(element3,1,1);
      var morph4 = dom.createMorphAt(element3,3,3);
      var morph5 = dom.createMorphAt(dom.childAt(element0, [5]),3,3);
      var morph6 = dom.createMorphAt(dom.childAt(element0, [7]),1,1);
      var morph7 = dom.createMorphAt(dom.childAt(element0, [9]),0,0);
      content(env, morph0, context, "title");
      content(env, morph1, context, "available");
      content(env, morph2, context, "availableUnits");
      content(env, morph3, context, "total");
      content(env, morph4, context, "totalUnits");
      inline(env, morph5, context, "c3-chart", [], {"data": get(env, context, "radial_data"), "config": get(env, context, "radial_config"), "donut": get(env, context, "radial_donut"), "size": get(env, context, "radial_size"), "legend": get(env, context, "radial_legend"), "color": get(env, context, "radial_color"), "tooltip": get(env, context, "radial_tooltip")});
      inline(env, morph6, context, "c3-chart", [], {"data": get(env, context, "sparkline_data"), "config": get(env, context, "sparkline_config"), "area": get(env, context, "sparkline_settings"), "size": get(env, context, "sparkline_size"), "axis": get(env, context, "sparkline_axis"), "point": get(env, context, "sparkline_point"), "legend": get(env, context, "sparkline_legend"), "color": get(env, context, "sparkline_color"), "tooltip": get(env, context, "sparkline_tooltip")});
      content(env, morph7, context, "legendLeftText");
      return fragment;
    }
  };
}()));