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
        'chartId': 'networkUsageCurrentChart',
        'dataName': 'MHz'
    },
    'dailyNetworkUsageConfig': {
        'chartId': 'networkUsageDailyChart',
        'dataName': 'MHz'
    },
    'podTrendConfig': {
        'chartId': 'podTrendsChart',
        'dataName': 'Pods'
    },
    'imageTrendConfig': {
        'chartId': 'imageTrendsChart',
        'dataName': 'Images'
    }
}