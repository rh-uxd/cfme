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
        'units'      : 'MHz'
    },
    'dailyNetworkUsageConfig': {
        'chartId'  : 'networkUsageDailyChart',
        'headTitle': 'Network Utilization Trends',
        'timeFrame': 'Last 30 Days',
        'units'    : 'MHz'
    },
    'podTrendConfig': {
        'chartId'  : 'podTrendsChart',
        'headTitle': 'Total Pods Trends',
        'timeFrame': 'Last 30 Days',
        'units'    : 'Pods'
    },
    'imageTrendConfig': {
        'chartId'  : 'imageTrendsChart',
        'headTitle': 'Total Images Trends',
        'timeFrame': 'Last 30 Days',
        'units'    : 'Images'
    },

}
