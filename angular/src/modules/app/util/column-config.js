angular.module('miq.util').factory('ColumnsConfig', [function columnsConfigFactory () {
  return {
    nameColumnWidth: 160,
    cpuUsageColumnWidth: 150,
    cpuUsageTitleWidth: 95,
    memoryUsageColumnWidth: 180,
    memoryUsageTitleWidth: 135,
    networkUsageColumnWidth: 220,
    networkUsageTitleWidth: 150,
    nodesColumnWidth: 120,
    podsColumnWidth: 120,
    containersColumnWidth: 160,
    servicesColumnWidth: 125,
    registriesColumnWidth: 130,
    imagesColumnWidth: 140,
    projectsColumnWidth: 140,
    routesColumnWidth: 130,
    replicatorsColumnWidth: 150,
    uptimeColumnWidth: 150,
    providerColumnWidth: 160,
    sessionsColumnWidth: 125,
    serverGroupsColumnWidth: 175
  };
}]);
