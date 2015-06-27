var nodeObjectId = 0;

var randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getUsedValue = function(total) {
    var used;

    var bucketPercent = randomInt(0, 100);
    if (bucketPercent < 65) {
        used = Math.floor(randomInt(20, (total * 0.70)));
    }
    else if (bucketPercent < 85) {
        used = Math.floor(randomInt((total * 0.70), (total * 0.80)));
    }
    else if (bucketPercent < 95) {
        used = Math.floor(randomInt((total * 0.80), (total * 0.90)));
    }
    else {
        used = Math.floor(randomInt((total * 0.90), total));
    }

    return used;
};

        var randomizeData = function (openShiftCount, kubernetesCount) {
            var newData = [];

            for (var i = 0; i < openShiftCount; i++) {
                var total = 100;
                var used = getUsedValue(total);
                var available = total - used;
                var value = used / total;
                var valuePercent = Math.floor(value * 100);

                newData.push({
                    id: nodeObjectId++,
                    value: value,
                    tooltip: [
                        'Node ' + k + ' : My OpenShift Provider',
                        '' + valuePercent + '% : ' + used + ' Used of ' + total + ' Total',
                        '' + available + ' Available'
                    ].join('<br/>')
                });
            }

            for (var k = 0; k < kubernetesCount; k++) {
                var total = 100;
                var used = getUsedValue(total);
                var available = total - used;
                var value = used / total;
                var valuePercent = Math.floor(value * 100);

                newData.push({
                    id: nodeObjectId++,
                    value: value,
                    tooltip: [
                        'Node ' + k + ' : My Kubernetes Provider',
                        '' + valuePercent + '% : ' + used + ' Used of ' + total + ' Total',
                        '' + available + ' Available'
                    ].join('<br/>')
                });
            }

            newData.sort(function (a, b) {
                return b.value - a.value;
            });

            return newData;
        };