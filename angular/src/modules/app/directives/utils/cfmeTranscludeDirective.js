
'use strict';

angular
    .module('cfme.utils').directive( 'cfmeTransclude', function() {
        return {
            restrict: 'EAC',
            link: function( $scope, $element, $attrs, controller, $transclude ) {
                if (!$transclude) {
                    throw new Error('cfmeTransclude - ' +
                            'Illegal use of cfmeuiTransclude directive in the template! ' +
                            'No parent directive that requires a transclusion found. ' +
                            'Element: {0}');
                }

                /* jshint -W069 */
                var iScopeType = $attrs['cfmeTransclude'] || 'sibling';

                switch ( iScopeType ) {
                    case 'sibling':
                        $transclude( function( clone ) {
                            $element.empty();
                            $element.append( clone );
                        });
                        break;
                    case 'parent':
                        $transclude( $scope, function( clone ) {
                            $element.empty();
                            $element.append( clone );
                        });
                        break;
                    case 'child':
                        var iChildScope = $scope.$new();
                        $transclude( iChildScope, function( clone ) {
                            $element.empty();
                            $element.append( clone );
                            $element.on( '$destroy', function() {
                                iChildScope.$destroy();
                            });
                        });
                        break;
                }
            }
        };
    });