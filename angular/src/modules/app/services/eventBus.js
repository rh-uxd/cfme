
'use strict';

/**
 * Wrapper for EventEmitter:
 * https://github.com/Wolfy87/EventEmitter/blob/master/docs/guide.md
 */
/* global EventEmitter */
angular.module('cfme.services').factory('CfmeEventBus', function () {
    var eventService = new EventEmitter();
    eventService.onWithDestroy = function (eventName, callback, $scope) {

        if (angular.isDefined($scope) === false)
        {
            throw new Error('you must include the scope as the 3rd argument to eventBus.onWithDestroy');
        }

        eventService.on(eventName, callback);

        $scope.$on('$destroy', function () {
            eventService.off(eventName, callback);
        });
    };

    /**
     * use remove listener(s) instead.  remove event will remove the event and all listeners.
     * Since we use eventBus globally, removeEvent will affect all code in different views/modules.
     */
    eventService.removeEvent = function () {
        throw new Error('cfmeEventBus: Unsupported Operation');
    };

    //on, off, emit, once are the typical usages
    return eventService;
});
