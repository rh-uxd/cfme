var chartConfig = {
	'cpuUsageConfig' : {
    	'chartId': 'cpuUsageChart',
        'title': 'CPU',
        'units': 'Cores',
        'usageDataName': 'Used',
        'legendLeftText': 'Last 30 Days',
        'legendRightText': '',
       	'numDays': 30
    },
    'memoryUsageConfig': {
        'chartId': 'memoryUsageChart',
        'title': 'Memory',
        'units': 'GB',
        'usageDataName': 'Used',
        'legendLeftText': 'Last 30 Days',
        'legendRightText': '',
        'numDays': 30
    },
    'storageUsageConfig': {
    	'chartId': 'storageUsageChart',
        'title': 'Storage',
        'units': 'TB',
        'usageDataName': 'Used',
        'legendLeftText': 'Last 30 Days',
        'legendRightText': '',
        'numDays': 30
    },
    'networkUsageConfig': {
    	'chartId': 'networkUsageChart',
        'title': 'Network',
        'units': '  Gbps',
        'usageDataName': 'Used',
        'legendLeftText': 'Last 30 Days',
        'legendRightText': '',
        'numDays': 30
    },
    'currentNetworkUsageConfig': {
        'chartId'    : 'networkUsageCurrentChart',
        'headTitle'  : 'Current Network Utilization',
        'timeFrame'  : 'Last 15 Minutes',
        'units'      : 'MHz',
        'dataName': 'MHz'
    },
    'dailyNetworkUsageConfig': {
        'chartId'  : 'networkUsageDailyChart',
        'headTitle': 'Network Utilization Trends',
        'timeFrame': 'Last 30 Days',
        'units'    : 'MHz',
        'dataName': 'MHz'

    },
    'podTrendConfig': {
        'chartId'  : 'podTrendsChart',
        'headTitle': 'Total Pods Trends',
        'timeFrame': 'Last 30 Days',
        'units'    : 'Pods',
        'dataName': 'Pods'
    },
    'imageTrendConfig': {
        'chartId'  : 'imageTrendsChart',
        'headTitle': 'Total Images Trends',
        'timeFrame': 'Last 30 Days',
        'units'    : 'Images',
        'dataName': 'Images'
    },
  'podCpuUsageConfig' : {
    'chartId': 'cpuUsageChart',
    'title': 'CPU',
    'units': 'milliCores',
    'usageDataName': 'Used',
    'legendLeftText': 'Last 30 Days',
    'legendRightText': '',
    'numDays': 30
  },
  'podMemoryUsageConfig': {
    'chartId': 'memoryUsageChart',
    'title': 'Memory',
    'units': 'MB',
    'usageDataName': 'Used',
    'legendLeftText': 'Last 30 Days',
    'legendRightText': '',
    'numDays': 30
  },
  'podDailyNetworkUsageConfig': {
    'chartId'  : 'networkUsageDailyChart',
    'headTitle': 'Network Utilization Trends',
    'timeFrame': 'Last 24 Hours',
    'units'    : 'MHz',
    'dataName': 'MHz'

  },
}
