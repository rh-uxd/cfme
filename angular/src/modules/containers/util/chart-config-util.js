var chartConfig = {
	'cpuUsageConfig' : {
    	'chartId': 'cpuUsageChart',
        'title': 'CPU',
        'totalUnits': 'Cores',
        'usageDataName': 'Used',
        'legendLeftText': 'Last 30 Days',
        'legendRightText': '',
       	'numDays': 30
    },
    'memoryUsageConfig': {
        'chartId': 'memoryUsageChart',
        'title': 'Memory',
        'totalUnits': 'GB',
        'usageDataName': 'Used',
        'legendLeftText': 'Last 30 Days',
        'legendRightText': '',
        'numDays': 30
    },
    'storageUsageConfig': {
    	'chartId': 'storageUsageChart',
        'title': 'Storage',
        'totalUnits': 'TB',
        'usageDataName': 'Used',
        'legendLeftText': 'Last 30 Days',
        'legendRightText': '',
        'numDays': 30
    },
    'networkUsageConfig': {
    	'chartId': 'networkUsageChart',
        'title': 'Network',
        'totalUnits': '  Gbps',
        'usageDataName': 'Used',
        'legendLeftText': 'Last 30 Days',
        'legendRightText': '',
        'numDays': 30
    },
    'currentNetworkUsageConfig': {
        'labels': ['% Used'],
        'tooltipSuffixes': ['% Used']
    },
    'dailyNetworkUsageConfig': {
        'labels': ['% Used'],
        'tooltipSuffixes': ['% Used']
    },
    'podTrendConfig': {
        'labels': ['Created'],
        'tooltipSuffixes': ['Pods']
    },
    'imageCreationsTrendConfig': {
        'labels': ['Images'],
        'tooltipSuffixes': ['']
    }
}