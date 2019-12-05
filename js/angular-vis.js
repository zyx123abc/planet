angular.module('ngVis', [])

    .factory('VisDataSet', function () {
        'use strict';
        return function (data, options) {
            // Create the new dataSets
            return new vis.DataSet(data, options);
        };
    })



/**
 * Directive for network chart.
 */
    .directive('visNetwork', ['ui_graph_api', function (ui_graph_api) {
        return {
            restrict: 'EA',
            transclude: false,
            scope: {
                data: '=',
                options: '=',
                events: '=',
                control: '=',
                outnetworks: '=',
                ctrlparams: '='
            },
            
            replace: true,

            // template: '<div>A:{{internalControl}} and {{a}}</div>',

            link: function (scope, element, attr) {

                // scope.internalControl = scope.control || {};
                // scope.internalControl.takenTablets = 0;
                // scope.internalControl.takeTablet = function() {
                //     scope.internalControl.takenTablets += 1;
                // }


              //   scope.a = 1;

              // // self calling function to init
              //   (function () {
              //     scope.a += 1;
              //   }());


                scope.network = scope.outnetworks || null;
                scope.networkViewInfo = scope.control || {};

                scope.$watch('data', function () {
                    // Sanity check
                    if (scope.data == null) {
                        return;
                    }

                    // If we've actually changed the data set, then recreate the graph
                    // We can always update the data by adding more data to the existing data set
                    
                    if (scope.network != null) {
                        scope.network.destroy();
                    }

                    // Create the graph2d object
                    console.log('Module drawing network')

                    scope.network = new vis.Network(element[0], scope.data, scope.options);

                    // TO DO: put controlParams elsewhere 
                    scope.network.controlParams = scope.ctrlparams || null;

                    // EVENTS
                    var networkEvents = [
                        'click',
                        'doubleClick',
                        'oncontext',
                        'hold',
                        'release',
                        'selectNode',
                        'selectEdge',
                        'deselectNode',
                        'deselectEdge',
                        'dragStart',
                        'dragging',
                        'dragEnd',
                        'hoverNode',
                        'blurNode',
                        'hoverEdge',
                        'blurEdge', 
                        'zoom',
                        'showPopup',
                        'hidePopup',
                        'startStabilizing',
                        'stabilizationProgress',
                        'stabilizationIterationsDone',
                        'stabilized',
                        'resize',
                        'initRedraw',
                        'beforeDrawing',
                        'afterDrawing',
                        'animationFinished',
                        'configChange'
                    ];



                    scope.networkViewInfo = scope.control || {};
                    
                    scope.networkViewInfo = {
                            'node_coords': scope.network.getPositions(),
                            'curr_scale': scope.network.getScale(),
                            'curr_viewPos': scope.network.getViewPosition()
                    };

                    // scope.control = scope.networkViewInfo;



                    // Attach an event handler if defined
                    angular.forEach(scope.events, function (callback, event) {
                        // console.log(scope.events)
                        if (networkEvents.indexOf(String(event)) >= 0) {
                            scope.network.on(event, callback);
                        }
                    });

                    // onLoad callback
                    if (scope.events != null && scope.events.onload != null &&
                        angular.isFunction(scope.events.onload)) {
                        scope.events.onload(graph);
                    }


                    console.log('********* new graph from vis', scope.network, 'with data: ', scope.data, ', with options: ', scope.options);
                    

                    var endpoint = ui_graph_api.endpoints.initGraph;
                    ui_graph_api.callAPI(scope.network, endpoint);


                    scope.outnetworks = scope.network


                });

                // OPTIONS

                scope.$watchCollection('options', function (options) {
                    if (scope.network == null) { return;}
                    scope.network.setOptions(options);
                    
                });
            }
        };
    }])

