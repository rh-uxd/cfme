angular.module('miq.util').factory('ListUtils', ['ColumnsConfig', function listUtilsFactory (columnsConfig) {
  var nameColumn = {
    columnType: 'label',
    field: 'name',
    width: columnsConfig.nameColumnWidth
  };
  var providerColumn = {
    columnType: 'objectLabel',
    columnClass: 'provider-column',
    field: 'providerName',
    iconImage: 'providerImg',
    width: columnsConfig.providerColumnWidth
  };

  var cpuUsedPercentColumn = {
    columnType: 'titleLabel',
    title: 'CPU Used (%)',
    field: 'cpuUsed',
    titleWidth: columnsConfig.cpuUsageTitleWidth
  };

  var cpuCoresUsageColumn = {
    columnType: 'usage',
    usedLabel: 'CPU Used (c)',
    totalLabel: 'Total (c)',
    usedDataField: 'cpuUsageData',
    width: columnsConfig.cpuUsageColumnWidth,
    titleWidth: columnsConfig.cpuUsageTitleWidth
  };

  var cpuMilliCoresUsageColumn = {
    columnType: 'usage',
    usedLabel: 'CPU Used (mc)',
    totalLabel: 'Total (mc)',
    usedDataField: 'cpuUsageData',
    width: columnsConfig.cpuUsageColumnWidth,
    titleWidth: columnsConfig.cpuUsageTitleWidth
  };

  var memoryMBUsageColumn = {
    columnType: 'usage',
    columnClass: 'memory-usage-column',
    usedLabel: 'Memory Used (MB)',
    totalLabel: 'Total (MB)',
    usedDataField: 'memoryUsageData',
    width: columnsConfig.memoryUsageColumnWidth,
    titleWidth: columnsConfig.memoryUsageTitleWidth
  };

  var memoryGBUsageColumn = {
    columnType: 'usage',
    columnClass: 'memory-usage-column',
    usedLabel: 'Memory Used (GB)',
    totalLabel: 'Total (GB)',
    usedDataField: 'memoryUsageData',
    width: columnsConfig.memoryUsageColumnWidth,
    titleWidth: columnsConfig.memoryUsageTitleWidth
  };

  var nodesInfoColumn = {
    columnType: 'objectCount',
    infoField: 'nodesInfo',
    width: columnsConfig.nodesColumnWidth
  };

  var podsInfoColumn = {
    columnType: 'objectCount',
    infoField: 'podsInfo',
    width: columnsConfig.podsColumnWidth
  };

  var containersInfoColumn = {
    columnType: 'objectCount',
    infoField: 'containersInfo',
    width: columnsConfig.containtersColumnWidth
  };

  var servicesInfoColumn = {
    columnType: 'objectCount',
    infoField: 'servicesInfo',
    width: columnsConfig.servicesColumnWidth
  };

  var imagesInfoColumn = {
    columnType: 'objectCount',
    infoField: 'imagesInfo',
    width: columnsConfig.imagesColumnWidth
  };

  var projectsInfoColumn = {
    columnType: 'objectCount',
    infoField: 'projectsInfo',
    width: columnsConfig.projectsColumnWidth
  };

  var routesInfoColumn = {
    columnType: 'objectCount',
    infoField: 'routesInfo',
    width: columnsConfig.routesColumnWidth
  };

  var registriesInfoColumn = {
    columnType: 'objectCount',
    infoField: 'registriesInfo',
    width: columnsConfig.registriesColumnWidth
  };

  var uptimeColumn = {
    columnType: 'titleLabel',
    title: 'Uptime',
    field: 'uptime',
    width: columnsConfig.uptimeColumnWidth
  };

  var sessionsInfoColumn = {
    columnType: 'objectCount',
    infoField: 'sessionsInfo',
    width: columnsConfig.sessionsColumnWidth
  };

  var serverGroupsInfoColumn = {
    columnType: 'objectCount',
    infoField: 'serverGroupsInfo',
    width: columnsConfig.serverGroupsColumnWidth
  };

  var clustersInfoColumn = {
    columnType: 'objectCount',
    infoField: 'clustersInfo',
    width: columnsConfig.clustersColumnWidth
  };

  var hostsInfoColumn = {
    columnType: 'objectCount',
    infoField: 'hostsInfo',
    width: columnsConfig.hostsColumnWidth
  };

  var dataStoresInfoColumn = {
    columnType: 'objectCount',
    infoField: 'dataStoresInfo',
    width: columnsConfig.dataStoresColumnWidth
  };

  var vmsInfoColumn = {
    columnType: 'objectCount',
    infoField: 'vmsInfo',
    width: columnsConfig.vmsColumnWidth
  };

  var templatesInfoColumn = {
    columnType: 'objectCount',
    infoField: 'templatesInfo',
    width: columnsConfig.templatesColumnWidth
  };


  var nameFilter = {
    id: 'name',
    title:  'Name',
    placeholder: 'Filter by Name',
    filterType: 'text'
  };

  var providerFilter = {
    id: 'provider',
    title:  'Provider',
    placeholder: 'Filter by Provider',
    filterType: 'text'
  };

  var providerTypeFilter = {
    id: 'providerType',
    title:  'Provider Type',
    placeholder: 'Filter by Provider Type',
    filterType: 'select',
    filterValues: ['Kubernetes', 'OpenShift']
  };

  var matchesFilter = function (item, filter) {
    var match = true;

    if (filter.id === 'name') {
      match = item.name.match(filter.value) !== null;
    } else if (filter.id === 'providerType') {
      match = item.providerType.toLowerCase() === filter.value.toLowerCase();
    } else if (filter.id === 'provider') {
      match = item.providerName.match(filter.value) !== null;
    }
    return match;
  };

  var matchesFilters = function (item, filters) {
    var matches = true;

    filters.forEach(function(filter) {
      if (!matchesFilter(item, filter)) {
        matches = false;
        return false;
      }
    });
    return matches;
  };

  var applyFilters = function (items, filterConfig) {
    var filteredItems = items;
    if (filterConfig.appliedFilters && filterConfig.appliedFilters.length > 0) {
      filteredItems = [];
      items.forEach(function (item) {
        if (matchesFilters(item, filterConfig.appliedFilters)) {
          filteredItems.push(item);
        }
      });
    }

    filterConfig.resultsCount = filteredItems.length;
    return filteredItems;
  };

  var nameSort = {
    id: 'name',
    title:  'Name',
    sortType: 'alpha'
  };

  var providerSort = {
    id: 'provider',
    title:  'Provider',
    sortType: 'alpha'
  };

  var providerTypeSort = {
    id: 'providerType',
    title:  'Provider Type',
    sortType: 'alpha'
  };

  var cpuPercentUsedSort = {
    id: 'cpuPercentUsed',
    title:  'CPU Used',
    sortType: 'numeric'
  };

  var cpuUsageSort = {
    id: 'cpuUsage',
    title:  'CPU Used',
    sortType: 'numeric'
  };

  var memoryUsageSort = {
    id: 'memoryUsage',
    title:  'Memory Used',
    sortType: 'numeric'
  };

  var nodesSort = {
    id: 'nodes',
    title:  'Nodes Count',
    sortType: 'numeric'
  };

  var podsSort = {
    id: 'pods',
    title:  'Pods Count',
    sortType: 'numeric'
  };

  var containersSort = {
    id: 'containers',
    title:  'Containers Count',
    sortType: 'numeric'
  };

  var servicesSort = {
    id: 'services',
    title:  'Services Count',
    sortType: 'numeric'
  };

  var registriesSort = {
    id: 'registries',
    title:  'Registries Count',
    sortType: 'numeric'
  };

  var imagesSort = {
    id: 'images',
    title:  'Images Count',
    sortType: 'numeric'
  };

  var projectsSort = {
    id: 'projects',
    title:  'Projects Count',
    sortType: 'numeric'
  };

  var routesSort = {
    id: 'routes',
    title:  'Routes Count',
    sortType: 'numeric'
  };

  var uptimeSort = {
    id: 'uptime',
    title:  'Uptime',
    sortType: 'numeric'
  };

  var clustersSort = {
    id: 'clustersInfo.count',
    title:  'Clusters Count',
    sortType: 'numeric'
  };
  var hostsSort = {
    id: 'hostsInfo.count',
    title:  'Hosts Count',
    sortType: 'numeric'
  };
  var dataStoresSort = {
    id: 'dataStoresInfo.count',
    title:  'Datastores Count',
    sortType: 'numeric'
  };
  var vmsSort = {
    id: 'vmsInfo.count',
    title:  'VMs Count',
    sortType: 'numeric'
  };
  var templatesSort = {
    id: 'templatesInfo.count',
    title:  'Templates Count',
    sortType: 'numeric'
  };
  var sortList = function (items, sortField, isAscending) {
    var sortId = sortField.id;
    var compareFn = function(item1, item2) {
      var compValue = 0;
      if (sortId === 'name') {
        compValue = item1.name.localeCompare(item2.name);
      } else if (sortId === 'provider') {
        compValue = item1.providerName.localeCompare(item2.providerName);
      } else if (sortId === 'providerType') {
        compValue = item1.providerType.localeCompare(item2.providerType);
      } else if (sortId === 'cpuPercentUsed') {
        compValue = item1.cpuUsed - item2.cpuUsed;
      } else if (sortId === 'cpuUsage') {
        compValue = item1.cpuUsageData.used - item2.cpuUsageData.used;
      } else if (sortId === 'memoryUsage') {
        compValue = item1.memoryUsageData.used - item2.memoryUsageData.used;
      } else if (sortId === 'nodes') {
        compValue = item1.nodesInfo.count - item2.nodesInfo.count;
      } else if (sortId === 'pods') {
        compValue = item1.podsInfo.count - item2.podsInfo.count;
      } else if (sortId === 'containers') {
        compValue = item1.containersInfo.count - item2.containersInfo.count;
      } else if (sortId === 'services') {
        compValue = item1.servicesInfo.count - item2.servicesInfo.count;
      } else if (sortId === 'images') {
        compValue = item1.imagesInfo.count - item2.imagesInfo.count;
      } else if (sortId === 'projects') {
        compValue = item1.projectsInfo.count - item2.projectsInfo.count;
      } else if (sortId === 'routes') {
        compValue = item1.routesInfo.count - item2.routesInfo.count;
      } else if (sortId === 'registries') {
        compValue = item1.registriesInfo.count - item2.registriesInfo.count;
      } else if (sortId === 'uptime') {
        compValue = item1.uptime.localeCompare(item2.uptime);
      } else if (angular.isDefined(item1[sortId])) {
        if (sortField.sortType == 'numeric') {
          compValue = item1[sortId] - item2[sortId];
        } else {
          compValue = item1[sortId].localeCompare(item2[sortId]);
        }
      }


      if (compValue === 0 && angular.isDefined(item1.name)) {
        compValue = item1.name.localeCompare(item2.name);
      }

      if (!isAscending) {
        compValue = compValue * -1;
      }

      return compValue;
    };

    if (items && items.length > 0) {
      items.sort(compareFn);
    }
  };

  return {
    nameColumn:               nameColumn,
    providerColumn:           providerColumn,
    cpuUsedPercentColumn:     cpuUsedPercentColumn,
    cpuCoresUsageColumn:      cpuCoresUsageColumn,
    cpuMilliCoresUsageColumn: cpuMilliCoresUsageColumn,
    memoryMBUsageColumn:      memoryMBUsageColumn,
    memoryGBUsageColumn:      memoryGBUsageColumn,
    nodesInfoColumn:          nodesInfoColumn,
    podsInfoColumn:           podsInfoColumn,
    containersInfoColumn:     containersInfoColumn,
    servicesInfoColumn:       servicesInfoColumn,
    imagesInfoColumn:         imagesInfoColumn,
    projectsInfoColumn:       projectsInfoColumn,
    routesInfoColumn:         routesInfoColumn,
    registriesInfoColumn:     registriesInfoColumn,
    uptimeColumn:             uptimeColumn,
    sessionsInfoColumn:       sessionsInfoColumn,
    serverGroupsInfoColumn:   serverGroupsInfoColumn,
    clustersInfoColumn:       clustersInfoColumn,
    hostsInfoColumn:          hostsInfoColumn,
    dataStoresInfoColumn:     dataStoresInfoColumn,
    vmsInfoColumn:            vmsInfoColumn,
    templatesInfoColumn:      templatesInfoColumn,
    nameFilter:               nameFilter,
    providerFilter:           providerFilter,
    providerTypeFilter:       providerTypeFilter,
    applyFilters:             applyFilters,
    nameSort:                 nameSort,
    providerSort:             providerSort,
    providerTypeSort:         providerTypeSort,
    cpuPercentUsedSort:       cpuPercentUsedSort,
    cpuUsageSort:             cpuUsageSort,
    memoryUsageSort:          memoryUsageSort,
    nodesSort:                nodesSort,
    podsSort:                 podsSort,
    containersSort:           containersSort,
    servicesSort:             servicesSort,
    imagesSort:               imagesSort,
    projectsSort:             projectsSort,
    routesSort:               routesSort,
    registriesSort:           registriesSort,
    uptimeSort:               uptimeSort,
    clustersSort:             clustersSort,
    hostsSort:                hostsSort,
    dataStoresSort:           dataStoresSort,
    vmsSort:                  vmsSort,
    templatesSort:            templatesSort,
    sortList:                 sortList
  };
}]);
