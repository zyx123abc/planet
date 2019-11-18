
app.controller('MainCtrl', ["$scope","$http", 'VisDataSet', 'ui_graph_api', 'ui_events',
    function($scope, $http, VisDataSet, ui_graph_api, ui_events) {
        $scope.search_res = null;
        $scope.toggle_search = function() {
            
            console.log('!!!!!!!!!!!!!!!!!!!!!!toggle search works!', $scope.search_res);
            // if($scope.search_res !== null){
            //     console.log('??????')

            //     var endpoint = ui_graph_api.endpoints.induceGraphWithHops;
            //         $scope.input_search.node_id_list = $scope.search_res.slice(-1).pop();
            //         console.log($scope.input_search)
        
                    
            //         ui_graph_api.callAPI($scope.ctrlnetworks, endpoint, $scope.input_search);
            //         // $scope.search_res = null;
            // }

        }  

        $scope.test_fun = function() {
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
            return true;
        } 

        $scope.test_button = function() {
            console.log('bbbbbbbbbb');
            
        } 

    $scope.companies = ['Apple','Microsoft'];
        /*for bootstrap.ui.typeahead example*/

    $http.get("http://localhost:5000/api/GetNodeList")
                .then(function(response) {
                $scope.availableCompanies = response.data;
                // console.log($scope.availableCompanies);
            });
    // $scope.availableCompanies = 

    //     ['ACCO Brands',
    //         'Accuquote',
    //         'Accuride Corporation',
    //         'Ace Hardware',
    //         'Google',
    //         'FaceBook',
    //         'Paypal',
    //         'Pramati',
    //         'Bennigan',
    //         'Berkshire Hathaway',
    //         'Berry Plastics',
    //         'Best Buy',
    //         'Carlisle Companies',
    //         'Carlson Companies',
    //         'Carlyle Group',
    //         'Denbury Resources',
    //         'Denny',
    //         'Dentsply',
    //         'Ebonite International',
    //         'EBSCO Industries',
    //         'EchoStar',
    //         'Gateway, Inc.',
    //         'Gatorade',
    //         'Home Shopping Network',
    //         'Honeywell',
    //     ];



    $scope.focusinControl = {'take':4};

    $scope.entity_hobs =[1,2,3,4,5];


    $scope.input_search = {
        "node_id_list": null,
        "hops":1
    };

    // $scope.ctrlnetworks.controlParams.focal_items












    $scope.networkViewInfo = {};

    
    $scope.options = default_graph_options;
    




    $scope.init = function() {
        console.log('----> init RE network')
        $scope.nodes = new vis.DataSet();
        $scope.edges = new vis.DataSet();

        $scope.data = {
            nodes: $scope.nodes,
            edges: $scope.edges
        };

        $scope.ctrlnetworks = null;

        console.log('----> initializing ui events');



        // ui_events.ui_events._setEntityList()
        //     .then(function(response) {
        //     $scope.entity_id_list = response.data;
        //     console.log('get entity lists: ', $scope.entity_id_list)
        // });

        // ui_events._setNetworkDrawingEvents($scope.ctrlnetworks);
    }

    $scope.init();

    //     console.log('----> initializing graph from session');
    //     console.log('network: ', $scope.ctrlnetworks)
    //     console.log('networkViewInfo: ', $scope.networkViewInfo)
    //     var endpoint = ui_graph_api.endpoints.initGraph;

        // var networkViewInfo = {node_coords: {}, curr_scale: 1, curr_viewPos: {x: 0, y: 0}}
        // // ui_api_call.api.testApi(endpoint, networkViewInfo);
        // ui_graph_api.callAPI($scope.ctrlnetworks, endpoint)


    $http.get("http://localhost:5000/api/GetNodeList")
            .then(function(response) {
                $scope.entity_id_list = response.data;
            });

    $scope.test = function() {
        console.log($scope.ctrlnetworks.getSelectedNodes())
    }

    $scope.InduceGraphWithHops = function(params) {
        var endpoint = ui_graph_api.endpoints.induceGraphWithHops;
        ui_graph_api.callAPI($scope.ctrlnetworks, endpoint, params);
      
    } 


    $scope._getSessionData = function(network) {

        var endpoint = "http://localhost:5000/api/GetSessionData";
        
    }

    $scope.expandGraph = function() {
        console.log('----> expanding graph');
        var endpoint = ui_graph_api.endpoints.expandGraph;
        ui_graph_api.callAPI($scope.ctrlnetworks, endpoint);
    };  

    $scope.removeNodes = function() {

        console.log('----> removing graph nodes');
        var endpoint = ui_graph_api.endpoints.removeNodes;
        // nodeIDList = $scope.ctrlnetworks.getSelectedNodes();
        console.log($scope.ctrlnetworks.getSelectedNodes())
        ui_graph_api.callAPI($scope.ctrlnetworks, endpoint);

        };

     

function _updateGraph(response_data) {
        
        // called after API response is successful
        // sets response variables based on API response
        // if response requires network refresh, calls draw_network function to do so
        var responses = {};
        responses.resp_boolUpdatedStatus = response_data.bool_update_status;
        responses.resp_strFocalNodeIDList = response_data.str_focal_node_id_list;
        responses.resp_intNumNodes = response_data.int_num_nodes;
        responses.resp_intNumEdges = response_data.int_num_edges;
        responses.resp_intNumComponents = response_data.int_num_components;


        responses.resp_jsonGraph = response_data.json_graph;
        responses.network_view_info = response_data.network_view_info;

        if (responses.resp_boolUpdatedStatus == true) {
            console.log('redrawing network');
            drawNetwork(responses.resp_jsonGraph, responses.network_view_info);

        } else {
            console.log('no need to redraw network');
            $scope.controlParams.networkViewOptions = responses.network_view_info;
        }
    };


    function drawNetwork(jsonGraph, networkViewOptions) {
        // update network object
        // jsonGraph - jsonified networkx graph to display
        // user_view_position - the current x,y position the user is on
        // user_view_scale - the current scale (zoom) the user is on

        var curr_scale = networkViewOptions.curr_scale
        var curr_view_pos = networkViewOptions.curr_viewPos

        $scope.nodes = new vis.DataSet(jsonGraph.nodes);

        // console.log('nodes: ', $scope.nodes)

        $scope.edges = _getEdges(jsonGraph.edges)


        $scope.controlParams.jsonGraph = jsonGraph
        $scope.controlParams.networkViewOptions = networkViewOptions
        $scope.controlParams.allEdges = jsonGraph['edges']
        $scope.controlParams.allNodes = jsonGraph['nodes']

        $scope.data = { nodes: $scope.nodes, edges: $scope.edges };
        
        // $scope.ctrlnetworks.setData($scope.data);
        // network.moveTo({ position: curr_view_pos, scale: curr_scale });
        // network.redraw();



    };


    function _getEdges(allEdgeList) {
        // select appropriate edges to display
        // - splitCurrencies = true --> display edges aggregated by currenvy
        // - splitCurrencies = false --> display total aggregated edges

        // TODO:
        // minDate / maxData --> filter out transactions outside of date range
        // to do this in UI, would need to loop individual transactions within aggregated edges
        // and recreate aggregation - best to do this in API instead

        // split edges into two separate arrays
        // one containing 'all' currencies aggregated edges
        // one containing individual currency aggregated edges
        var e_all_curr = []
        var e_split_curr = []
        for (var edge of allEdgeList) {
            if (edge.curr_cd == 'all') {
                e_all_curr.push(edge)
            } else {
                e_split_curr.push(edge)
            }
        }
        // pick appropriate edge array depending on splitCurrencies toggle setting
        if ($scope.controlParams.splitCurrencies == true) {
            var e = e_split_curr
        } else {
            var e = e_all_curr
        }

        return e
    }









  



    $scope.events = {};


    $scope.events.click = function (params) {

         // console.warn('Event "click" triggered');
         // console.log.apply(console, arguments);



         var timer = 0;
         var delay = 200;
         var prevent = false;

         timer = setTimeout(function() {
                if (!prevent) {

                    // TODO: else if used becauuse clicking node also highlights edges
                    if (params.nodes.length > 0) {
                        
                        $scope.info = ui_events.ui_actions._nodeSingleClickAction($scope.ctrlnetworks, params)
                        $scope.info.focal = 'node';

                        console.log('info', $scope.info)
                        $scope.$apply()
                    } else if (params.edges.length > 0) {
                        
                        $scope.info = ui_events.ui_actions._edgeSingleClickAction($scope.ctrlnetworks, params)
                        $scope.info.focal = 'edge';
                        console.log('info', $scope.info)
                        $scope.$apply()
                    }
                }
                prevent = false;
        }, delay);
    };
    

    $scope.events.doubleClick = function () {
         // console.warn('Event "doubleClick" triggered');
         // console.log.apply(console, arguments);
    };
    
    $scope.events.oncontext = function () {
         // console.warn('Event "oncontext" triggered');
         // console.log.apply(console, arguments);
    };
    
    $scope.events.hold = function () {
         // console.warn('Event "hold" triggered');
         // console.log.apply(console, arguments);
    };
    
    $scope.events.release = function () {
         // console.warn('Event "release" triggered');
         // console.log.apply(console, arguments);
    };
    
    $scope.events.selectNode = function () {
         // console.warn('Event "selectNode" triggered');
         // console.log.apply(console, arguments);
    };
    
    $scope.events.selectEdge = function () {
         // console.warn('Event "selectEdge" triggered');
         // console.log.apply(console, arguments);
    };
    
    // $scope.events.deselectNode = function () {
    //      console.warn('Event "deselectNode" triggered');
    //      console.log.apply(console, arguments);
    // };
    
    // $scope.events.deselectEdge = function () {
    //      console.warn('Event "deselectEdge" triggered');
    //      console.log.apply(console, arguments);
    // };
    
    // $scope.events.dragStart = function () {
    //      console.warn('Event "dragStart" triggered');
    //      console.log.apply(console, arguments);
    // };
    
    // $scope.events.dragging = function () {
    //      console.warn('Event "dragging" triggered');
    //      console.log.apply(console, arguments);
    // };
    
    // $scope.events.dragEnd = function () {
    //      console.warn('Event "dragEnd" triggered');
    //      console.log.apply(console, arguments);
    // };
    
    // $scope.events.hoverNode = function () {
    //      console.warn('Event "hoverNode" triggered');
    //      console.log.apply(console, arguments);
    // };
    
    // $scope.events.blurNode = function () {
    //      console.warn('Event "blurNode" triggered');
    //      console.log.apply(console, arguments);
    // };
    
    // $scope.events.zoom = function () {
    //      console.warn('Event "zoom" triggered');
    //      console.log.apply(console, arguments);
    // };
    
    // $scope.events.showPopup = function () {
    //      console.warn('Event "showPopup" triggered');
    //      console.log.apply(console, arguments);
    // };
    
    // $scope.events.hidePopup = function () {
    //      console.warn('Event "hidePopup" triggered');
    //      console.log.apply(console, arguments);
    // };
    
    // $scope.events.startStabilizing = function () {
    //      console.warn('Event "startStabilizing" triggered');
    //      console.log.apply(console, arguments);
    // };
    
    // $scope.events.stabilizationProgress = function () {
    //      console.warn('Event "stabilizationProgress" triggered');
    //      console.log.apply(console, arguments);
    // };
    
    // $scope.events.stabilizationIterationsDone = function () {
    //      console.warn('Event "stabilizationIterationsDone" triggered');
    //      console.log.apply(console, arguments);
    // };
    
    // $scope.events.stabilized = function () {
    //      console.warn('Event "stabilized" triggered');
    //      console.log.apply(console, arguments);
    // };
    
    // $scope.events.resize = function () {
    //      console.warn('Event "resize" triggered');
    //      console.log.apply(console, arguments);
    // };
    
    // $scope.events.initRedraw = function () {
    //      console.warn('Event "initRedraw" triggered');
    //      console.log.apply(console, arguments);
    // };
    
    // $scope.events.beforeDrawing = function () {
    //      console.warn('Event "beforeDrawing" triggered');
    //      console.log.apply(console, arguments);
    // };
    
    // $scope.events.afterDrawing = function () {
        // console.log('after ',$scope.ctrlnetworks.body.nodeIndices)
        
         // console.log.apply(console, arguments);
    // };
    
    // $scope.events.animationFinished = function () {
    //      console.warn('Event "animationFinished" triggered');
    //      console.log.apply(console, arguments);
    // };
    


$scope.events.beforeDrawing = function () {

            // iterate through nodes in data.

        angular.forEach($scope.ctrlnetworks.body.nodeIndices, function (nodeID) {

                  var node = $scope.ctrlnetworks.body.nodes[nodeID];

                  if ($scope.ctrlnetworks.controlParams.colorTheme == 'colTheme_default') {
                    

                    // var bg_col = 'rgba(28, 37, 50, 0.8)' // TODO: add to config
                    var bg_col = 'rgba(161, 161, 180, 0.2)' // TODO: add to config

                    node.setOptions({
                        shadow: { 'enabled': false},
                        // color: node.defaultOptions.color
                        color: {
                            background: bg_col , border: bg_col,
                            highlight: {background: bg_col, border: bg_col}
                        }
                    });
                } else if ($scope.ctrlnetworks.controlParams.colorTheme == 'colTheme_community') {
                    
                    var nodeColor = node.options['theme_community_color']
                    var nodeShadow = node.options['theme_community_shadow']
                    node.setOptions({
                        color: nodeColor,
                        shadow: nodeShadow
                    });
                } else {
                    
                    // catch unmapped color schemes and set all to whire
                    node.setOptions({
                        shadow: { 'enabled': false},
                        color: {
                            background: '#ffffff' , border: '#ffffff' ,
                            highlight: {background: '#ffffff' , border: '#ffffff' }
                        }
                    });
                }


        });             

                angular.forEach($scope.ctrlnetworks.body.edgeIndices, function (edgeID) {
                    var edge = $scope.ctrlnetworks.body.edges[edgeID]
                //console.log('edge:', network.body.data.edges._data[edgeID]['to'], network.body.data.edges._data[edgeID]['from'])

                var nodeToFrom = JSON.stringify([edge['fromId'], edge['toId']])
                //network.controlParams.focal_items.edge_list.includes(nodeREID)
                //console.log(network.controlParams.focal_items.edge_list.includes(nodeToFrom))
                //console.log([edge['fromId'], edge['toId']], network.controlParams.focal_items.edge_list)

                var edgeIsFocal = (JSON.stringify($scope.ctrlnetworks.controlParams.focal_items.edge_list).indexOf(nodeToFrom)!=-1)
                var edgeIsSelected = ($scope.ctrlnetworks.getSelectedEdges().includes(edgeID))

                var edgeCurrency = $scope.ctrlnetworks.body.data.edges._data.get(edgeID).curr_cd

                // default color and dash settings
                var dash = false
                var col = '#586e75'

                if (edgeIsSelected) {
                    var dash = true
                };

                // set color for currency
                if (edgeCurrency in currencyColors) {
                    var col = currencyColors[edgeCurrency]
                }

                // override colors for focal edges
                if (edgeIsFocal) {
                    var col = '#d33682'
                    var dash = true
                }

                if ($scope.ctrlnetworks.controlParams.colorTheme == 'colTheme_default') {
                    edge.setOptions({
                        color: { 'color': col, highlight:'#268bd2', },
                        dashes: dash
                    });
                } else {
                    // use colors in data from api - which colors by community
                    // comumunity detection/colorization is done by API to reduce browser-side computation
                    edge.setOptions({
                        color: { },
                        dashes: dash
                    });
                }             
            });
    };



    $scope.events.afterDrawing = function (ctx) {

    // iterate through nodes in data.
        // $scope.ctrlnetworks.body.nodeIndices

        angular.forEach($scope.ctrlnetworks.body.data.nodes, function (node) {
            
            _drawNodeIcons($scope.ctrlnetworks, ctx, node)
            _drawNodeHighlights($scope.ctrlnetworks, ctx, node)
            _drawNodeGlyphs($scope.ctrlnetworks, ctx, node)
        });

     //    var dataURL = ctx.canvas.toDataURL();
        // console.log('********afterDrawing: ', dataURL)

    };


    function _drawNodeIcons(network, context, n) {

        // var nodeExpandableCt = network.body.data.nodes._data[nodeID]['expandable_ct']
        var nodeExpandableCt = n['expandable_ct']
        var nodeMergedCt = n['merged_ct']
        var focalEntityNode = n['focal']

        var features = n['feature_list']

        // var nodePosition = network.getPositions([n.id]);

        var nodeLeftPos = network.body.nodes[n.id].shape.left
        var nodeTopPos = network.body.nodes[n.id].shape.top
        var nodeRadius = network.body.nodes[n.id].shape.radius

        var currentColorTheme = $scope.ctrlnetworks.controlParams.colorTheme;

        var font_type = 'Free' // font awesome free version

        if (currentColorTheme == 'colTheme_default') {

            if (features.type == "person") {
                // context.fillStyle = '#b58900';
                var icon_fillStyle = '#b58900';
                var icon = '\uF007'
            } else if (features.type == "company") {
                // context.fillStyle = '#2aa198';
                var icon_fillStyle = '#2aa198';
                var icon = '\uF1AD'
                if (features.industry == "cryptocurrency") {
                    // var secondary_icon_fillstyle = '#0099ff'
                    var font_type = 'Brands'
                    var icon = '\uF379'
                } else if (features.industry == "jewellery") {
                    // var secondary_icon_fillstyle = '#0099ff'
                    var icon = '\uF3A5'
                } else if (features.industry == "unclassified") {
                    // var secondary_icon_fillstyle = '#0099ff'
                    var icon = '\uF1AD'
                }


            } else {
                // context.fillStyle = '#000000';
                var icon_fillStyle = '#000000';
                var icon = '\uF1E2' // black bomb symbolizes error / unmapped classification
            }

        } else if (currentColorTheme == 'colTheme_community') {

            if (features.type == "person") {
                var icon_fillStyle = '#ffffff';
                var secondary_icon_fillstyle = '#ffffff'
                // context.fillStyle = '#ffffff';
                var icon = '\uF007'
            } else if (features.type == "company") {
                var icon_fillStyle = '#ffffff';
                var secondary_icon_fillstyle = '#ffffff'

                var icon = '\uF1AD'
                if (features.industry == "cryptocurrency") {
                    // var secondary_icon_fillstyle = '#0099ff'
                    var font_type = 'Brands'
                    var icon = '\uF379'
                } else if (features.industry == "jewellery") {
                    // var secondary_icon_fillstyle = '#0099ff'
                    var icon = '\uF3A5'
                } else if (features.industry == "unclassified") {
                    // var secondary_icon_fillstyle = '#0099ff'
                    var icon = '\uF1AD'
                }

            } else {
                var icon_fillStyle = '#000000';
                var secondary_icon_fillstyle = '#ffffff'
                // context.fillStyle = '#000000';
                var icon = '\uF1E2' // black bomb symbolizes error / unmapped classification
            }

        }

        context.fillStyle = icon_fillStyle;
        context.font = '900 ' + nodeRadius + 'px "Font Awesome 5 ' + font_type + '"'
        var icon_width = context.measureText(icon).width
        context.fillStyle = icon_fillStyle;
        context.fillText(icon, nodeLeftPos + (nodeRadius) - (icon_width/2), nodeTopPos + (nodeRadius/2))

        // adds an outline around the icons
        // context.setLineDash([])
        // context.lineWidth = 0.5
        // context.strokeStyle = 'white';
        // context.strokeText(icon, nodeLeftPos + (nodeRadius) - (icon_width/2), nodeTopPos + (nodeRadius/2))

    }


    function _drawNodeHighlights(network, context, n) {

        var focalEntityNode = n['focal']
        var nodeREID = n['id']

        // console.log('????????????', nodeREID, focalEntityNode)
        var nodePosition = network.getPositions([n.id]);
        var nodeLeftPos = network.body.nodes[n.id].shape.left
        var nodeTopPos = network.body.nodes[n.id].shape.top
        var nodeRadius = network.body.nodes[n.id].shape.radius

        var nodeCenterX = nodeLeftPos+nodeRadius
        var nodeCenterY = nodeTopPos+nodeRadius

        // FOCAL ENTITY NODES
        // highlight with a dashed circle 
        // console.log('????????????', $scope.ctrlnetworks.controlParams)
        if ($scope.ctrlnetworks.controlParams.focal_items.node_list.includes(nodeREID)) {
        //if (focalEntityNode == true) {

            context.beginPath();
            context.setLineDash([2]);
            context.strokeStyle = "#d33682";
            context.lineWidth = 1;
            context.arc(nodeCenterX, nodeCenterY, nodeRadius*3, 0, 2 * Math.PI, false);
            context.stroke();
        }

        // SELECTED NODES
        // highlight with a dashed circle
        if (network.getSelectedNodes().includes(n.id) ) {
            context.beginPath();
            context.setLineDash([2]);
            context.lineWidth = 1;
            context.strokeStyle = "#268bd2";
            context.arc(nodeCenterX, nodeCenterY, nodeRadius*4, 0, 2 * Math.PI, false);
            context.stroke();
        }
    }



    function _drawNodeGlyphs(network, context, n) {

        var nodeExpandableCt = n['expandable_ct']
        var nodeMergedCt = n['merged_ct']
        var focalEntityNode = n['focal']

        var features = n['feature_list']

        //TODO: add glyph for focal entity
        // - then test focal entity contraction (especially after searching/adding node)
        //var image = new Image();

        var nodePosition = network.getPositions([n.id]);
        var nodeLeftPos = network.body.nodes[n.id].shape.left
        var nodeTopPos = network.body.nodes[n.id].shape.top
        var nodeRadius = network.body.nodes[n.id].shape.radius
        var nodeCenterX = nodeLeftPos+nodeRadius
        var nodeCenterY = nodeTopPos+nodeRadius

        if (nodeExpandableCt > 0) {
            var font_size = nodeRadius
            context.fillStyle = 'rgba(139,210,205,0.8)';
            context.font = '900 ' + font_size + 'px "Font Awesome 5 Free"';
            var icon = '\uF055'
            var icon_width = context.measureText(icon).width
            context.fillText(icon, nodeCenterX + nodeRadius*1.4 - icon_width, nodeCenterY - nodeRadius*1.4)
        }

        if (nodeMergedCt > 0) {
            context.fillStyle = 'rgba(139,210,205,0.8)';
            context.font = '900 ' + font_size + 'px "Font Awesome 5 Free"';
            var icon = '\uF78C' // TODO: find better merge icon
            var icon_width = context.measureText(icon).width
            var nodeCenterX = nodeLeftPos+nodeRadius
            var nodeCenterY = nodeTopPos+nodeRadius
            context.fillText(icon, nodeCenterX - nodeRadius*1.4 , nodeCenterY + nodeRadius*1.4 - icon_width)
        }

    }










    // $scope.events.doubleClick = function (params) {
    //      console.warn('Event "doubleClick" triggered');
    //      console.log.apply(console, arguments);

    //      nodeIDList = $scope.ctrlnetworks.getSelectedNodes();

    //      var timer = 0;
    //      var delay = 200;
    //      var prevent = false;

    //      clearTimeout(timer);
    //         prevent = true;
    //         if (params.nodes.length >= 0) {
                
    //             params.event = "node double-clicked";

    //             ui_events.ui_actions._nodeDoubleClickAction($scope.networkViewInfo, nodeIDList, params)
    //                .then(function(response) {
                
    //                     if ('focal_items' in response.data) {
    //                         $scope.controlParams.focal_items = response.data['focal_items'];
    //                         // console.log('controlParams: ', $scope.controlParams);
    //                     }

    //                     _updateGraph(response.data);

    //                 });
    //         }
    // };


    $(window).scroll(function() {
        if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
            $('#return-to-top').fadeIn(200);    // Fade in the arrow
        } else {
            $('#return-to-top').fadeOut(200);   // Else fade out the arrow
        }
    });
        

    $scope.backToTop = function() {
        $("html, body").animate({ scrollTop: 0 }, 500);
    }; // back to top ended








    }
    ]);