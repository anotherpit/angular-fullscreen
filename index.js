(function() { 'use strict';

/**
 * @ngdoc module
 * @name anotherpit/angular-rect
 * @author anotherpit <anotherpit@gmail.com>
 */
var module = angular.module('anotherpit/angular-fullscreen', ['ng']);

/**
 * @ngdoc service
 * @name fullscreen
 */
module.factory('fullscreen', ['$document', '$rootScope', function($document, $rootScope) {
    return {
        $$emitter: (function(){
            var emitter = $rootScope.$new();
            var events = 'fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange';
            function emit() {
                emitter.$emit('change');
            }
            $document.on(events, emit)
            emitter.$on('$destroy', function() {
                $document.off(events, emit);
            });
            return emitter;
        }()),
        /**
         * Add event listener. Currently 'change' is the only event.
         * @param {string} name Event name, e.g. 'change'
         * @param {Function} listener
         * @returns {Function} Function to unbind the given listener
         */
        on: function(name, listener) {
            return this.$$emmiter.$on(name, listener);
        },
        /**
         * @returns {bool}
         */
        isSupported: function() {
            var dom = $document[0].documentElement;
            return dom.requestFullScreen
                || dom.mozRequestFullScreen
                || dom.webkitRequestFullScreen
                || dom.webkitRequestFullscreen
                || dom.msRequestFullscreen;
        },
        /**
         * @returns {bool}
         */
        isActive: function() {
            return !!this.getActiveElement();
        },
        /**
         * @returns {jqLite|null}
         */
        getActiveElement: function() {
            var doc = $document[0];
            var dom = doc.fullscreenElement
                || doc.mozFullScreenElement
                || doc.webkitFullscreenElement
                || doc.msFullscreenElement;
            return dom ? angular.element(dom) : null;
        },
        /**
         * @param {jqLite}
         * @returns this
         */
        activate: function(element) {
            if (this.isSupported()) {
                var dom = element[0];
                if (dom.requestFullscreen) {
                    dom.requestFullscreen();
                } else if (dom.webkitRequestFullscreen) {
                    dom.webkitRequestFullscreen();
                } else if (dom.mozRequestFullScreen) {
                    dom.mozRequestFullScreen();
                } else if (dom.webkitRequestFullScreen) {
                    dom.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                } else if (dom.webkitRequestFullscreen) {
                    dom.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                } else if (dom.msRequestFullscreen) {
                    dom.msRequestFullscreen();
                }
            }
            return this;
        },
        /**
         * @returns this
         */
        deactivate: function() {
            if (this.isSupported()) {
                var doc = $document[0];
                if (doc.exitFullscreen) {
                    doc.exitFullscreen();
                } else if (doc.webkitExitFullscreen) {
                    doc.webkitExitFullscreen();
                } else if (doc.mozCancelFullScreen) {
                    doc.mozCancelFullScreen();
                } else if (doc.cancelFullScreen) {
                    doc.cancelFullScreen();
                } else if (doc.mozCancelFullScreen) {
                    doc.mozCancelFullScreen();
                } else if (doc.webkitCancelFullScreen) {
                    doc.webkitCancelFullScreen();
                } else if (doc.webkitCancelFullscreen) {
                    doc.webkitCancelFullscreen();
                } else if (doc.msExitFullscreen) {
                    doc.msExitFullscreen();
                }
            }
            return this;
        }
    };
}]);

/**
 * @ngdoc type
 * @name FullscreenController
 */
FullscreenController.$inject = ['$element', 'fullscreen']
function FullscreenController($element, fullscreen) {
    angular.extend(this, {
        /**
         * @returns {bool}
         */
        isSupported: function() {
            return fullscreen.isSupported();
        },
        /**
         * @returns {bool}
         */
        isActive: function() {
            var active = fullscreen.getActiveElement();
            return active && (active[0] === $element[0]);
        },
        /**
         * @param {bool} [on=false]
         * @returns this
         */
        setActive: function(on) {
            if (on) {
                fullscreen.activate($element);
            } else {
                fullscreen.deactivate();
            }
            return this;
        }
    });
}
module.controller('FullscreenController', FullscreenController);

/**
 * @ngdoc directive
 * @name fullscreen
 * @restrict A
 * @element ANY
 * @description
 * Simple wrapper for ng-controller="FullscreenController"
 */
module.directive('fullscreen', function() {
    return {
        restrict: 'A',
        controller: 'FullscreenController'
    }
});

}());
