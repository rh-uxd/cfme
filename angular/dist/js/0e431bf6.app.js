angular.module("patternfly.pf-components",[]),angular.module("patternfly.pf-components").directive("pfTile",function(){return{restrict:"A",transclude:!0,scope:{headtitle:"@",subtitle:"@"},templateUrl:"modules/app/directives/tile/tile.html"}}),angular.module("cfme.containers.dashboardModule",["pascalprecht.translate","ui.bootstrap"]),angular.module("cfme.containers.dashboardModule").controller("containers.dashboardController",["$scope","$translate","$resource",function(a,b,c){"use strict";var d=this;d.navigaition="containers";var e=c("/containers/dashboard/status");e.get(function(a){d.status_widgets=a.data.status,d.providers=a.data.types}),d.cpuUsageConfig=chartConfig.cpuUsageConfig,d.memoryUsageConfig=chartConfig.memoryUsageConfig,d.storageUsageConfig=chartConfig.storageUsageConfig,d.networkUsageConfig=chartConfig.networkUsageConfig,d.utilizationLoadingDone=!1;var f=c("/containers/dashboard/utilization");f.get(function(a){var b=a.data;d.cpuUsageData=b.cpuUsageData,d.memoryUsageData=b.memoryUsageData,d.storageUsageData=b.storageUsageData,d.networkUsageData=b.networkUsageData,d.utilizationLoadingDone=!0}),d.containerGroupTrendConfig=chartConfig.containerGroupTrendConfig,d.imageCreationsTrendConfig=chartConfig.imageCreationsTrendConfig,d.containerGroupTrendsLoadingDone=!1;var g=c("/containers/dashboard/container-groups");g.get(function(a){d.containerGroupTrends=a.data.containerGroupTrends,d.containerGroupTrendsLoadingDone=!0}),d.imageCreationsLoadingDone=!1;var h=c("/containers/dashboard/image-creations");h.get(function(a){d.imageCreations=a.data.imageCreations,d.imageCreationsLoadingDone=!0}),d.nodeCpuUsageLoadingDone=!1;var i=c("/containers/dashboard/node-cpu-usage");i.get(function(a){d.nodeCpuUsage=a.data.nodeCpuUsage,d.nodeCpuUsageLoadingDone=!0}),d.nodeMemoryUsageLoadingDone=!1;var j=c("/containers/dashboard/node-memory-usage");j.get(function(a){d.nodeMemoryUsage=a.data.nodeMemoryUsage,d.nodeMemoryUsageLoadingDone=!0}),d.nodeStorageUsageLoadingDone=!1;var k=c("/containers/dashboard/node-storage-usage");k.get(function(a){d.nodeStorageUsage=a.data.nodeStorageUsage,d.nodeStorageUsageLoadingDone=!0}),d.nodeNetworkUsageLoadingDone=!1;var l=c("/containers/dashboard/node-network-usage");l.get(function(a){d.nodeNetworkUsage=a.data.nodeNetworkUsage,d.nodeNetworkUsageLoadingDone=!0}),d.nodeHeatMapUsageLegendLabels=["< 70%","70-80%","80-90%","> 90%"],d.nodeHeatMapNetworkLegendLabels=["Very High","High","Low","Very Low"]}]),angular.module("cfme.containers.providersModule",["pascalprecht.translate","ui.bootstrap"]),angular.module("cfme.containers.providersModule").controller("containers.providersController",["$scope","$translate","$resource","$routeParams",function(a,b,c,d){"use strict";var e=this;e.navigaition="Providers";var f=d.id;"undefined"==typeof f&&(f="openshift");var g=c("/containers/providers/status/:id");g.get({id:f},function(a){e.status_widgets=a.data.status,e.providers=a.data.types}),e.cpuUsageConfig=chartConfig.cpuUsageConfig,e.memoryUsageConfig=chartConfig.memoryUsageConfig,e.storageUsageConfig=chartConfig.storageUsageConfig,e.networkUsageConfig=chartConfig.networkUsageConfig,e.utilizationLoadingDone=!1;var h=c("/containers/dashboard/utilization");h.get(function(a){var b=a.data;e.cpuUsageData=b.cpuUsageData,e.memoryUsageData=b.memoryUsageData,e.storageUsageData=b.storageUsageData,e.networkUsageData=b.networkUsageData,e.utilizationLoadingDone=!0}),e.containerGroupTrendConfig=chartConfig.containerGroupTrendConfig,e.imageCreationsTrendConfig=chartConfig.imageCreationsTrendConfig,e.containerGroupTrendsLoadingDone=!1;var i=c("/containers/dashboard/container-groups");i.get(function(a){e.containerGroupTrends=a.data.containerGroupTrends,e.containerGroupTrendsLoadingDone=!0}),e.imageCreationsLoadingDone=!1;var j=c("/containers/dashboard/image-creations");j.get(function(a){e.imageCreations=a.data.imageCreations,e.imageCreationsLoadingDone=!0}),e.nodeCpuUsageLoadingDone=!1;var k=c("/containers/dashboard/node-cpu-usage");k.get(function(a){e.nodeCpuUsage=a.data.nodeCpuUsage,e.nodeCpuUsageLoadingDone=!0}),e.nodeMemoryUsageLoadingDone=!1;var l=c("/containers/dashboard/node-memory-usage");l.get(function(a){e.nodeMemoryUsage=a.data.nodeMemoryUsage,e.nodeMemoryUsageLoadingDone=!0}),e.nodeStorageUsageLoadingDone=!1;var m=c("/containers/dashboard/node-storage-usage");m.get(function(a){e.nodeStorageUsage=a.data.nodeStorageUsage,e.nodeStorageUsageLoadingDone=!0}),e.nodeNetworkUsageLoadingDone=!1;var n=c("/containers/dashboard/node-network-usage");n.get(function(a){e.nodeNetworkUsage=a.data.nodeNetworkUsage,e.nodeNetworkUsageLoadingDone=!0}),e.nodeHeatMapUsageLegendLabels=["< 70%","70-80%","80-90%","> 90%"],e.nodeHeatMapNetworkLegendLabels=["Very High","High","Low","Very Low"]}]),angular.module("cfme.containers.projectsModule",["pascalprecht.translate","ui.bootstrap"]),angular.module("cfme.containers.projectsModule").controller("containers.projectsController",["$scope","$translate","$resource","$routeParams",function(a,b,c,d){"use strict";var e=this,f=d.id;"undefined"==typeof f&&(f="openshift"),e.navigaition=" ruby-webapp-1 :  My OpenShift Provider";var g=c("/containers/projects/status/:id");g.get({id:f},function(a){e.status_widgets=a.data,e.providers=a.data.providers}),e.cpuUsageConfig=chartConfig.cpuUsageConfig,e.memoryUsageConfig=chartConfig.memoryUsageConfig,e.storageUsageConfig=chartConfig.storageUsageConfig,e.networkUsageConfig=chartConfig.networkUsageConfig,e.utilizationLoadingDone=!1;var h=c("/containers/dashboard/utilization");h.get(function(a){var b=a.data;e.cpuUsageData=b.cpuUsageData,e.memoryUsageData=b.memoryUsageData,e.storageUsageData=b.storageUsageData,e.networkUsageData=b.networkUsageData,e.utilizationLoadingDone=!0}),e.containerGroupTrendConfig=chartConfig.containerGroupTrendConfig,e.containerGroupTrendsLoadingDone=!1;var i=c("/containers/dashboard/container-groups");i.get(function(a){e.containerGroupTrends=a.data.containerGroupTrends,e.containerGroupTrendsLoadingDone=!0}),e.nodeCpuUsageLoadingDone=!1;var j=c("/containers/dashboard/node-cpu-usage");j.get(function(a){e.nodeCpuUsage=a.data.nodeCpuUsage,e.nodeCpuUsageLoadingDone=!0}),e.nodeMemoryUsageLoadingDone=!1;var k=c("/containers/dashboard/node-memory-usage");k.get(function(a){e.nodeMemoryUsage=a.data.nodeMemoryUsage,e.nodeMemoryUsageLoadingDone=!0}),e.nodeStorageUsageLoadingDone=!1;var l=c("/containers/dashboard/node-storage-usage");l.get(function(a){e.nodeStorageUsage=a.data.nodeStorageUsage,e.nodeStorageUsageLoadingDone=!0}),e.nodeNetworkUsageLoadingDone=!1;var m=c("/containers/dashboard/node-network-usage");m.get(function(a){e.nodeNetworkUsage=a.data.nodeNetworkUsage,e.nodeNetworkUsageLoadingDone=!0}),e.nodeHeatMapUsageLegendLabels=["< 70%","70-80%","80-90%","> 90%"],e.nodeHeatMapNetworkLegendLabels=["Very High","High","Low","Very Low"];var n=c("/containers/projects/quotas/:id");n.get({id:f},function(a){e.quotas=a.data})}]),angular.module("cfme.containersModule",["cfme.containers.projectsModule","cfme.containers.providersModule","cfme.containers.dashboardModule"]).config(["$routeProvider",function(a){a.when("/containers/dashboard",{templateUrl:"modules/containers/dashboard/dashboard.html",controller:"containers.dashboardController",controllerAs:"vm"}).when("/containers/projects",{templateUrl:"modules/containers/projects/projects.html",controller:"containers.projectsController",controllerAs:"vm"}).when("/containers/providers",{templateUrl:"modules/containers/providers/providers.html",controller:"containers.providersController",controllerAs:"vm"}).when("/containers/providers/:id",{templateUrl:"modules/containers/providers/providers.html",controller:"containers.providersController",controllerAs:"vm"})}]);var chartConfig={cpuUsageConfig:{chartId:"cpuUsageChart",title:"CPU",totalUnits:"MHz",usageDataName:"Used",legendLeftText:"Last 30 Days",legendRightText:"",numDays:30},memoryUsageConfig:{chartId:"memoryUsageChart",title:"Memory",totalUnits:"GB",usageDataName:"Used",legendLeftText:"Last 30 Days",legendRightText:"",numDays:30},storageUsageConfig:{chartId:"storageUsageChart",title:"Storage",totalUnits:"TB",usageDataName:"Used",legendLeftText:"Last 30 Days",legendRightText:"",numDays:30},networkUsageConfig:{chartId:"networkUsageChart",title:"Network",totalUnits:"  Gbps",usageDataName:"Used",legendLeftText:"Last 30 Days",legendRightText:"",numDays:30},containerGroupTrendConfig:{labels:["Created","Deleted"],tooltipSuffixes:["Container Group","Container Group"]},imageCreationsTrendConfig:{labels:["Images","Total Size"],tooltipSuffixes:["","GB"]}};angular.module("cfme.appModule",["ngResource","ngRoute","ui.bootstrap","pascalprecht.translate","patternfly.charts","patternfly.navigation","patternfly.pf-components","cfme.containersModule"]).config(["$routeProvider","$translateProvider",function(a,b){"use strict";a.when("/",{redirectTo:"/containers/dashboard"}).otherwise({redirectTo:"/"}),b.translations("default","en"),b.preferredLanguage("default")}]),angular.module("cfme.appModule").controller("cfme.appController",["$scope","$rootScope","$resource",function(a,b,c){"use strict";var d=this;d.username="Administrator",d.navigationItems=[];var e=c("/navigation");e.get(function(a){d.navigationItems=a.data}),d.notifications=[{text:"Modified Datasources ExampleDS"},{text:"Error: System Failure"}],d.clearNotifications=function(){d.notifications=[]}}]),angular.module("patternfly.navigation",[]).directive("pfNavigation",["$location","$rootScope",function(a,b){var c=["$scope",function(c){b.$on("$routeChangeSuccess",function(b,e,f){d(c);var g="#"+a.path();c.items.forEach(function(a){a.children&&a.children.forEach(function(b){g.indexOf(b.href)>-1&&(b["class"]="active",a["class"]="active")})})})}],d=function(a){a.items.forEach(function b(a){a.children?(a["class"]="",a.children.forEach(b)):a["class"]=""})};return{restrict:"A",scope:{items:"="},replace:!0,templateUrl:"modules/app/directives/navigation/navigation.html",link:function(b){b.$watch("items",function(c,d){if(0===d.length){var e="#"+a.path();b.items.forEach(function(a){a.children&&a.children.forEach(function(b){e.indexOf(b.href)>-1&&(b["class"]="active",a["class"]="active")})})}},!0)},controller:c}}]);