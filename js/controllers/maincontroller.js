app.controller('MainCtrl', ["$scope","$http", 'VisDataSet', 'ui_graph_api', 'ui_events', '$uibModal', '$log', '$document',
    function($scope, $http, VisDataSet, ui_graph_api, ui_events, $uibModal, $log, $document) {


// $scope.toggled = function(open) {
//     $log.log('Dropdown is now: ', open);
//   };

//   $scope.toggleDropdown = function($event) {
//     $event.preventDefault();
//     $event.stopPropagation();
//     $scope.status.isopen = !$scope.status.isopen;
//   };






// modal
var $ctrl = this;
  $ctrl.items = ['item1', 'item2', 'item3'];

  $ctrl.animationsEnabled = true;

  $ctrl.open = function (size, parentSelector) {
    var parentElem = parentSelector ? 
      angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      controllerAs: '$ctrl',
      size: size,
      appendTo: parentElem,
      resolve: {
        items: function () {
          return $ctrl.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $ctrl.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }; //open

    $ctrl.toggleAnimation = function () {
    $ctrl.animationsEnabled = !$ctrl.animationsEnabled;
  };











        


        // $scope.addStyle = function ($event){
        //     console.log("works!", $event)
        //     // angular.element( document.querySelector( '#div1' )).addClass('alpha');
        //     // $event.stopPropagation();  
        // }
        

        // $scope.addStyle = function (event){
        //     console.log("works!")
        //     angular.element('.form-group').addClass("sb-search-open");
        //     $event.stopPropagation();  
        // }

        // $scope.removeStyle = function (event){
        //     if($(event.target).is("#search") === false && angular.element(".form-control").val().length == 0)
        //     angular.element('.form-group').removeClass("sb-search-open");
        //     // $event.stopPropagation();  
        // }



        $scope.toggle_search = function($event) {
            var target = $event.target;
            console.log('!!!!!!!!!!!!!!!!!!!!!!toggle search works!', traget);
            // if($scope.search_res !== null){
            //     console.log('??????')

            //     var endpoint = ui_graph_api.endpoints.induceGraphWithHops;
            //         $scope.input_search.node_id_list = $scope.search_res.slice(-1).pop();
            //         console.log($scope.input_search)
        
                    
            //         ui_graph_api.callAPI($scope.ctrlnetworks, endpoint, $scope.input_search);
            //         // $scope.search_res = null;
            // }

        }  

        $scope.chipremove = function(chip) {
            // to do: remove node
            console.log('remove focal entity: ', [chip]);
            var endpoint = ui_graph_api.endpoints.removeNodes;
            ui_graph_api.callAPI($scope.ctrlnetworks, endpoint,  { 'remove focal': [chip] });
            

            return true;
        } 

        $scope.test_button = function() {
            console.log('bbbbbbbbbb');
            
        } 

        $scope.focal_details = function() {
            // console.log(typeof($scope.ctrlnetworks.controlParams.focal_items.full_list[1]))
            console.log('yyy: ')
        }




    $scope.input_search = {
        "node_id_list": null,
        "hops":1
    };




    $scope.networkViewInfo = {};


    $scope.options = default_graph_options;
    







    $scope.init_re_network = function() {
        console.log('----> init RE network')
        $scope.nodes = new vis.DataSet();
        $scope.edges = new vis.DataSet();

        $scope.data = {
            nodes: $scope.nodes,
            edges: $scope.edges
        };



        $scope.ctrlnetworks = null;
        $scope.re_controlParams = re_controlParams;

        console.log('----> initializing ui events');



        // ui_events.ui_events._setEntityList()
        //     .then(function(response) {
        //     $scope.entity_id_list = response.data;
        //     console.log('get entity lists: ', $scope.entity_id_list)
        // });

        // TO DO: set these two into functions

        $http.get("http://localhost:5000/api/GetNodeList")
        .then(function(response) {
            $scope.entity_id_list = response.data;
        });

        // ui_events._setNetworkDrawingEvents($scope.ctrlnetworks);

    }

    $scope.init_re_network();

    //     console.log('----> initializing graph from session');
    //     console.log('network: ', $scope.ctrlnetworks)
    //     console.log('networkViewInfo: ', $scope.networkViewInfo)
    //     var endpoint = ui_graph_api.endpoints.initGraph;

        // var networkViewInfo = {node_coords: {}, curr_scale: 1, curr_viewPos: {x: 0, y: 0}}
        // // ui_api_call.api.testApi(endpoint, networkViewInfo);
        // ui_graph_api.callAPI($scope.ctrlnetworks, endpoint)




// for ure_network:


    $scope.ure_options = ure_network_options;



    $scope.init_ure_network =  function() {
        // initialize the vis.js entity network visualization
        // create a dummy network for ui_graph_api api calls to populate

        // networks.ure_network_container = document.getElementById('ure_network');
        // networks.re_network_options = default_graph_options;
        $scope.ure_network = null;
        // $scope.ure_network_options = ure_network_options;

        $scope.ure_network_nodes = new vis.DataSet([{id: 1, text: 'deep', date: '2013-06-23', group: 2}]);
        $scope.ure_network_edges = new vis.DataSet([]);

        $scope.ure_network_data = {
            nodes: $scope.ure_network_nodes,
            edges: $scope.ure_network_edges
        };

        console.log('Initializing new empty network vis for UR modal')
        // networks.ure_network = new vis.Network(
        //     networks.ure_network_container,
        //     networks.ure_network_data,
        //     networks.ure_network_options
        // );

    }

    $scope.init_ure_network();



    $scope.test = function() {
        // console.log($scope.ctrlnetworks.getSelectedNodes())
    }

    $scope.search_res = null;
    $scope.InduceGraphWithHops = function() {
        console.log('induce: ', $scope.search_res.toString());
        $scope.input_search.node_id_list = $scope.search_res.toString();

        var endpoint = ui_graph_api.endpoints.induceGraphWithHops;
        ui_graph_api.callAPI($scope.ctrlnetworks, endpoint, $scope.input_search);
        $scope.search_res = null;
    } 

    $scope.removeNodes = function() {

        console.log('----> removing graph nodes');
        var endpoint = ui_graph_api.endpoints.removeNodes;
        // nodeIDList = $scope.ctrlnetworks.getSelectedNodes();
        console.log($scope.ctrlnetworks.getSelectedNodes())
        ui_graph_api.callAPI($scope.ctrlnetworks, endpoint);

        };


    $scope._getSessionData = function(network) {

        var endpoint = "http://localhost:5000/api/GetSessionData";
        
    }

    $scope.expandGraph = function() {
        console.log('----> expanding graph');
        var endpoint = ui_graph_api.endpoints.expandGraph;
        ui_graph_api.callAPI($scope.ctrlnetworks, endpoint);
    };  

    $scope.contractGraph = function() {
        console.log('----> contracting graph');
        var endpoint = ui_graph_api.endpoints.contractGraph;
        ui_graph_api.callAPI($scope.ctrlnetworks, endpoint);
    }; 


    $scope.Undo = function() {

        console.log('----> undoing graph');
        var endpoint = ui_graph_api.endpoints.undo;
        ui_graph_api.callAPI($scope.ctrlnetworks, endpoint,  { 'action': 'undo' });
    };

    $scope.Redo = function() {

        console.log('----> undoing graph');
        var endpoint = ui_graph_api.endpoints.redo;
        ui_graph_api.callAPI($scope.ctrlnetworks, endpoint, { 'action': 'redo' });
    };



    $scope.community = false;
    $scope.communityToggle = function() {
        console.log("----> change community")
        $scope.community = !$scope.community
       
        $scope.ctrlnetworks.controlParams.colorTheme = ($scope.community) ? "colTheme_community" : "colTheme_default"
        
        ui_graph_api.drawNetwork(
                $scope.ctrlnetworks.controlParams.jsonGraph,
                $scope.ctrlnetworks, 
                $scope.ctrlnetworks.controlParams.networkViewOptions
        );
    };
    // community ends

    $scope.currencyToggle = function() {
        console.log("----> change currency")
        $scope.ctrlnetworks.controlParams.splitCurrencies = !$scope.ctrlnetworks.controlParams.splitCurrencies;
        ui_graph_api.drawNetwork(
                $scope.ctrlnetworks.controlParams.jsonGraph,
                $scope.ctrlnetworks, 
                $scope.ctrlnetworks.controlParams.networkViewOptions)

    }// currency ends

    $scope.physicsToggle = function() {
        console.log("----> change physics to:")
        $scope.ctrlnetworks.physics.options.enabled = !$scope.ctrlnetworks.physics.options.enabled
        var physicsoption = ($scope.ctrlnetworks.physics.options.enabled) ? true : false
        $scope.ctrlnetworks.setOptions({ physics: physicsoption});
        console.log(physicsoption)
        // console.log($scope.options.physics)
        console.log($scope.ctrlnetworks.physics.options)
    }


  
    $scope.downloadGraph = function() {
        console.log("----> downloading graph", ui_events);
        ui_events._setUIControls_downloadModal($scope.ctrlnetworks.canvas.getContext());
    }


    // vis network event 
    $scope.events = {};

    $scope.events.click = function (params) {

         console.warn('Event "click" triggered');
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
    

    $scope.events.doubleClick = function (params) {
         console.warn('Event "doubleClick" triggered');
         // console.log.apply(console, arguments);
         var timer = 0;
         var delay = 200;
         var prevent = false;

         clearTimeout(timer);
         prevent = true;
         if (params.nodes.length >= 0) {
            
             params.event = "node double-clicked";
             ui_events.ui_actions._nodeDoubleClickAction($scope.ctrlnetworks, params);
         }

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











    // back to top
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



app.controller('ModalInstanceCtrl', function ($uibModalInstance, items) {
  var $ctrl = this;
  $ctrl.items = items;
  $ctrl.selected = {
    item: $ctrl.items[0]
  };

  $ctrl.ok = function () {
    $uibModalInstance.close($ctrl.selected.item);
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

// Please note that the close and dismiss bindings are from $uibModalInstance.

// app.component('modalComponent', {
//   templateUrl: 'myModalContent.html',
//   bindings: {
//     resolve: '<',
//     close: '&',
//     dismiss: '&'
//   },
//   controller: function () {
//     var $ctrl = this;

//     $ctrl.$onInit = function () {
//       $ctrl.items = $ctrl.resolve.items;
//       $ctrl.selected = {
//         item: $ctrl.items[0]
//       };
//     };

//     $ctrl.ok = function () {
//       $ctrl.close({$value: $ctrl.selected.item});
//     };

//     $ctrl.cancel = function () {
//       $ctrl.dismiss({$value: 'cancel'});
//     };
//   }
// });

