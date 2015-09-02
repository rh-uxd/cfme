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
        'title'      : 'Current Network Utilization',
        'timeFrame'  : 'Last 15 Minutes',
        'dataName'   : 'MHz'
    },
    'dailyNetworkUsageConfig': {
        'chartId'  : 'networkUsageDailyChart',
        'title'    : 'Network Utilization Trends',
        'timeFrame': 'Last 30 Days',
        'dataName' : 'MHz'
    },
    'podTrendConfig': {
        'chartId'  : 'podTrendsChart',
        'title'    : 'Total Pods Trends',
        'timeFrame': 'Last 30 Days',
        'dataName' : 'Pods'
    },
    'imageTrendConfig': {
        'chartId'  : 'imageTrendsChart',
        'title'    : 'Total Images Trends',
        'timeFrame': 'Last 30 Days',
        'dataName' : 'Images'
    },

}
