var chartConfig = {
	'cpuUsageConfig' : {
    	'chartId': 'cpuUsageChart',
        'title': 'CPU',
        'total_units': 'MHz',
        'usage_data_name': 'Used',
        'legend_left_text': 'Last 30 Days',
        'legend_right_text': '',
       	'num_days': 30
    },
    'memoryUsageConfig': {
        'chartId': 'memoryUsageChart',
        'title': 'Memory',
        'total_units': 'GB',
        'usage_data_name': 'Used',
        'legend_left_text': 'Last 30 Days',
        'legend_right_text': '',
        'num_days': 30
    },
    'storageUsageConfig': {
    	'chartId': 'storageUsageChart',
        'title': 'Storage',
        'total_units': 'TB',
        'usage_data_name': 'Used',
        'legend_left_text': 'Last 30 Days',
        'legend_right_text': '',
        'num_days': 30
    },
    'networkUsageConfig': {
    	'chartId': 'networkUsageChart',
        'title': 'Network',
        'total_units': '  Gbps',
        'usage_data_name': 'Used',
        'legend_left_text': 'Last 30 Days',
        'legend_right_text': '',
        'num_days': 30
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