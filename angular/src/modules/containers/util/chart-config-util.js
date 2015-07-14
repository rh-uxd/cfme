var chartConfig = {
	'cpuUsageConfig' : {
    	'chartId': 'cpuUsageChart',
        'title': 'CPU',
        'totalUnits': 'MHz',
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
    'containerGroupTrendConfig': {
        'labels': ['Created','Deleted'],
        'tooltipSuffixes': ['Container Group','Container Group']
    },
    'imageCreationsTrendConfig': {
        'labels': ['Images','Total Size'],
        'tooltipSuffixes': ['','GB']
    }
}