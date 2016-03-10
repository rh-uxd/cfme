angular.module('miq.util').factory('DashboardUtils', [function dashboardUtilsFactory () {
  var createProvidersStatus = function() {
    return {
      title: "Providers",
      count: 0,
      href: "#containers/providers",
      notifications: []
    };
  };
  var createNodesStatus = function() {
    return {
      title: "Nodes",
      iconClass: "pficon pficon-container-node",
      count: 0,
      notification: {}
    };
  };
  var createContainersStatus = function() {
    return {
      title: "Containers",
      iconClass: "fa fa-cube",
      count: 0,
      notification: {}
    };
  };
  var createRegistriesStatus = function() {
    return {
      title:  "Registries",
      iconClass: "pficon pficon-registry",
      count: 0,
      notification: {}
    };
  };
  var createProjectsStatus = function() {
    return {
      title: "Projects",
      iconClass: "pficon pficon-project",
      count: 0,
      href: "#containers/projects",
      notification: {}
    };
  };
  var createPodsStatus = function() {
    return {
      title: "Pods",
      iconClass: "fa fa-cubes",
      count: 0,
      href: "#containers/pods",
      notification: {}
    };
  };
  var createServicesStatus = function() {
    return {
      title: "Services",
      iconClass: "pficon pficon-service",
      count: 0,
      notification: {}
    };
  };
  var createImagesStatus = function() {
    return {
      title: "Images",
      iconClass: "pficon pficon-image",
      count: 0,
      notification: {}
    };
  };
  var createRoutesStatus = function() {
    return {
      title: "Routes",
      iconClass: "pficon pficon-route",
      count: 0,
      notification: {}
    };
  };
  var createClustersStatus = function() {
    return {
      title: "Clusters",
      href: "#/infrastructure/providers",
      count: 0,
      notifications: []
    };
  };
  var createHostsStatus = function() {
    return {
      title: "Hosts",
      iconClass: "fa fa-server",
      href: "#/infrastructure/providers",
      count: 0,
      notifications: []
    };
  };
  var createDatastoresStatus = function() {
    return {
      title: "Datastores",
      iconClass: "fa fa-database",
      href: "#/infrastructure/providers",
      count: 0,
      notifications: []
    };
  };
  var createVMsStatus = function() {
    return {
      title: "VMs",
      iconClass: "pficon pficon-screen",
      href: "#/infrastructure/providers",
      count: 0,
      notifications: []
    };
  };
  var createTemplatesStatus = function() {
    return {
      title: "Templates",
      iconClass: "pficon pficon-screen",
      href: "#/infrastructure/providers",
      count: 0,
      notifications: []
    };
  };
  var updateStatus = function (statusObject, data) {
    statusObject.notification = {};
    if (data) {
      statusObject.count = data.count;
      if (data.errorCount > 0) {
        statusObject.notification = {
          iconClass: "pficon pficon-error-circle-o",
          count: data.errorCount
        };
      }
      else if (data.warningCount > 0) {
        statusObject.notification = {
          iconClass: "pficon pficon-warning-triangle-o",
          count: data.warningCount
        };
      }
    } else {
      statusObject.count = 0;
    }
  };
  var updateAggregateStatus = function (statusObject, data) {
    statusObject.notifications = [];
    if (data) {
      statusObject.count = data.count;
      if (data.errorCount > 0) {
        statusObject.notifications.push({
          iconClass: "pficon pficon-error-circle-o",
          count: data.errorCount
        });
      }
      else if (data.warningCount > 0) {
        statusObject.notifications.push({
          iconClass: "pficon pficon-warning-triangle-o",
          count: data.warningCount
        });
      }
    } else {
      statusObject.count = 0;
    }
  };


  return {
    createProvidersStatus: createProvidersStatus,
    createNodesStatus: createNodesStatus,
    createContainersStatus: createContainersStatus,
    createRegistriesStatus: createRegistriesStatus,
    createProjectsStatus: createProjectsStatus,
    createPodsStatus: createPodsStatus,
    createServicesStatus: createServicesStatus,
    createImagesStatus: createImagesStatus,
    createRoutesStatus: createRoutesStatus,
    createClustersStatus: createClustersStatus,
    createHostsStatus: createHostsStatus,
    createDatastoresStatus: createDatastoresStatus,
    createVMsStatus: createVMsStatus,
    createTemplatesStatus: createTemplatesStatus,
    updateStatus: updateStatus,
    updateAggregateStatus: updateAggregateStatus
  };
}]);
