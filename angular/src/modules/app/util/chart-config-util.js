var chartConfig = {
  cpuUsageConfig: {
    chartId: 'cpuUsageChart',
    title: 'CPU',
    units: 'Cores',
    usageDataName: 'Used',
    legendLeftText: 'Last 30 Days',
    legendRightText: '',
    tooltipType: 'valuePerDay',
    numDays: 30
  },
  memoryUsageConfig: {
    chartId: 'memoryUsageChart',
    title: 'Memory',
    units: 'GB',
    usageDataName: 'Used',
    legendLeftText: 'Last 30 Days',
    legendRightText: '',
    tooltipType: 'valuePerDay',
    numDays: 30
  },
  storageUsageConfig: {
    chartId: 'storageUsageChart',
    title: 'Storage',
    units: 'TB',
    usageDataName: 'Used',
    legendLeftText: 'Last 30 Days',
    legendRightText: '',
    numDays: 30
  },
  networkUsageConfig: {
    chartId: 'networkUsageChart',
    title: 'Network',
    units:  'Gbps',
    usageDataName: 'Used',
    legendLeftText: 'Last 30 Days',
    legendRightText: '',
    tooltipType: 'valuePerDay',
    numDays: 30
  },
  currentNetworkUsageConfig: {
    chartId    : 'networkUsageCurrentChart',
    headTitle  : 'Current Network Utilization',
    timeFrame  : 'Last 15 Minutes',
    units      : 'KBps',
    dataName: 'KBps'
  },
  dailyNetworkUsageConfig: {
    chartId  : 'networkUsageDailyChart',
    headTitle: 'Network Utilization Trends',
    timeFrame: 'Last 30 Days',
    units    : 'KBps',
    dataName: 'KBps',
    tooltipType: 'valuePerDay'
  },
  podTrendConfig: {
    chartId  : 'podTrendsChart',
    headTitle: 'Total Pods Trends',
    timeFrame: 'Last 30 Days',
    units    : 'Pods',
    dataName: 'Pods',
    tooltipType: 'valuePerDay'
  },
  imageTrendConfig: {
    chartId  : 'imageTrendsChart',
    headTitle: 'Total Images Trends',
    timeFrame: 'Last 30 Days',
    units    : 'Images',
    dataName: 'Images',
    tooltipType: 'valuePerDay'
  },
  vmTrendConfig: {
    chartId  : 'vmTrendsChart',
    headTitle: 'Recently Discovered VMs',
    timeFrame: 'Last 30 Days',
    units    : 'VMs',
    dataName: 'VMs',
    tooltipType: 'valuePerDay'
  },
  hostTrendConfig: {
    chartId  : 'hostTrendsChart',
    headTitle: 'Recently Discovered Hosts',
    timeFrame: 'Last 30 Days',
    units    : 'Hosts',
    dataName: 'Hosts',
    tooltipType: 'valuePerDay'
  },
  podCpuUsageConfig: {
    chartId: 'cpuUsageChart',
    title: 'CPU',
    units: 'milliCores',
    tooltipType: 'valuePerDay',
    usageDataName: 'Used',
    legendLeftText: 'Last 30 Days',
    legendRightText: '',
    numDays: 30
  },
  podMemoryUsageConfig: {
    chartId: 'memoryUsageChart',
    title: 'Memory',
    units: 'MB',
    usageDataName: 'Used',
    legendLeftText: 'Last 30 Days',
    tooltipType: 'valuePerDay',
    legendRightText: '',
    numDays: 30
  },
  podDailyNetworkUsageConfig: {
    chartId  : 'networkUsageDailyChart',
    headTitle: 'Network Utilization Trends',
    tooltipType: 'valuePerDay',
    timeFrame: 'Last 24 Hours',
    units    : 'KBps',
    dataName : 'KBps'
  }
};
