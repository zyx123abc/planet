app.factory('ui_events', ["$filter","ui_graph_api", function ($filter, ui_graph_api) {

    var timeFromUTCDateHHMM = function(dateObj)
    {
        var utcDate = new Date(dateObj);
        var convertedTime;
        convertedTime = $filter('date')(utcDate, "hh:mm");
        console.log("processTime:: UTC Date:: "+utcDate+" :: Converted Date::"+ convertedTime);
        return convertedTime;
    };
    var timeFromUTCDateHHMMSS = function(dateObj)
    {
        var utcDate = new Date(dateObj);
        var convertedTime;
        convertedTime = $filter('date')(utcDate, "HH:mm:ss");
        console.log("processTime:: UTC Date:: "+utcDate+" :: Converted Date::"+ convertedTime);
        return convertedTime;
    };

    var _setUIControls_induceGraphWithHops = function(network, params) {

        var endpoint = ui_graph_api.endpoints.induceGraphWithHops;
        ui_graph_api.callAPI(network, endpoint, params);
        // TODO: need to set physics = True after new graph is drawn...
        network.setOptions({ physics: true })
    };

    var _setUIControls_genericAPI = function (network, endpoint, params) {

        console.log('_setUIControls_genericAPI with params', params, 'on network:', network);

        ui_graph_api.callAPI(network, endpoint, params);
      
    };

    var ui_actions = {

    _nodeDoubleClickAction: function(networkViewInfo, nodeIDList, params) {
        // double click of a node is used to explode the node

        // var curr_node_pos_dict = JSON.stringify(network.getPositions());
        // var curr_scale = JSON.stringify(network.getScale());
        // var curr_viewPos = JSON.stringify(network.getViewPosition());

        var nodeID = params['nodes']['0'];
        // console.log('fixing node prior to explode', nodeID)
        // var node = network.body.nodes[nodeID];
        // node.setOptions({
        //     fixed: { 'y': true, 'x': true },
        //     shadow: { 'enabled': false }
        // });

        var explode_node_list = JSON.stringify(params.nodes);
        console.log('node to explode: ', explode_node_list, typeof params.nodes, typeof explode_node_list);

        // get the x,y coordinate for each node clicked
        // this is used to set the initial x,y coordinate of each node that comes from the explosoin
        // console.log(params.pointer.DOM)

        // TODO: set physics == on prior to explode, the set physics == prior setting after explode.
        // first check that double click is on a node
        if (nodeID) {
            var endpoint = ui_graph_api.endpoints.explodeNodes;

            // ui_graph_api.callAPI(network,
            //     endpoint, { node_id_list: explode_node_list, clicked_node_coords: params.pointer.canvas }
            // );

        var promise = ui_api_call.api.callApi(endpoint, 
            networkViewInfo, nodeIDList, 
            { node_id_list: explode_node_list, clicked_node_coords: params.pointer.canvas });

        return promise;
        }
    },

    _nodeSingleClickAction: function (network, params) {
        
        // single click of a node is used to fix and unfix the position

        // TODO: add neighorhood highlighting - grey out all network except for selected node/community or node + hops?
        // like this example but the example doesnt work
        // https://visjs.org/examples/network/exampleApplications/neighbourhoodHighlight.html

        // var nodeID = params['nodes']['0'];
        // var node = network.body.nodes[nodeID];

        var nodeIDList = params['nodes'];
        // console.log('SINGLE CLICK', nodeIDList);    
        for (var nodeID of nodeIDList) {
            var nodeInfo = network.body.data.nodes._data.get(nodeID)
            // console.log('@@@', nodeInfo)
        }

        this._nodeFixUnfixAction(network, params)



        return nodeInfo;
    },

    _nodeFixUnfixAction: function(network, params) {
        var nodeIDList = params['nodes'];
        console.log('SINGLE CLICK', nodeIDList);



        // var node = network.body.nodes[nodeID];
        
        var fixed_nodes = []
        var unfixed_nodes = []

        for (var i = 0; i < nodeIDList.length; i++) {
            var nodeID = nodeIDList[i];
            var node = network.body.nodes[nodeID];
            if (nodeID) {
                if (network.body.nodes[nodeID].options.fixed.y) {
                    fixed_nodes.push(nodeID)
                } else {
                    unfixed_nodes.push(nodeID)
                }
            }
        }

        console.log('node fix actions fix-->unfix', fixed_nodes)
        console.log('node fix actions unfix-->fix', unfixed_nodes)

        if (fixed_nodes.length > 0) {
            console.log('SINGLE CLICK', nodeID, 'fixed --> unfixed')
            node.setOptions({
                fixed: { 'y': false, 'x': false },
                // shadow: { 'enabled': true, color: '#666666' }
            });

            var endpoint = ui_graph_api.endpoints.setNodeFix;

            ui_graph_api.callAPI(network,
                endpoint, { 'node_id_list': JSON.stringify(fixed_nodes), 'to_fix': false }
            );

            network.physics.enabled = true;
            network.physics.startSimulation();
        }

        if (unfixed_nodes.length > 0) {
            console.log('SINGLE CLICK', nodeID, 'Unfixed --> fixed')
            node.setOptions({
                fixed: { 'y': true, 'x': true },
                // shadow: { 'enabled': false }
            });

            var endpoint = ui_graph_api.endpoints.setNodeFix;
            ui_graph_api.callAPI(network,
                endpoint, { 'node_id_list': JSON.stringify(unfixed_nodes), 'to_fix': true }
            );

            network.physics.enabled = true;
            network.physics.startSimulation();
        }

        for (var nodeID of nodeIDList) {
            console.log(network.body.data.nodes._data.get(nodeID))

            var nodeInfo = network.body.data.edges._data.get(nodeID)
        }





    },

    _edgeSingleClickAction: function(network, params) {

        // must get clicked edgeID from params['items'], then get list of transactions for edgeID (because aggregated edges contain >= 1 trxn)
        // sometimes there are > 1 edgeIDs - this is where edges are merged due to node merge actions
        // then need to iterate through edgeIDs also
        // these are vis.js arbitrary edgeIDs - can't use them for any sort of api call
        // (an alternate method would be to get all data via API rather than local vis.js network object)
        // TODO: write python api call querying nx object and compare results
        var edgeTrxnInfo;
        var edgeList = network.getSelectedEdges();
        console.log('EDGES:', edgeList)

        var dispString = ""

        

        for (var edgeID of edgeList) {
            
            // console.log('***********',network.body.data.edges._data.get(edgeID)['trxnData']['trxn_list'])

            edgeTrxnInfo = network.body.data.edges._data.get(edgeID)['trxnData']['trxn_list']

            // for (var trxn of edgeTrxnInfo) {
            //     dispString = dispString + '<p>' + JSON.stringify(trxn) + '</p>'
            //     console.log('display string:', JSON.stringify(trxn))
            // }
        }
        console.log('../..', edgeTrxnInfo)
        return edgeTrxnInfo;
        // var edgeInfoBox = document.getElementById("infoEdgeTransactionList");
        // edgeInfoBox.innerHTML = dispString
    }


    }; //ui_actions ends

    return {
        timeFromUTCDateHHMM : timeFromUTCDateHHMM,
        timeFromUTCDateHHMMSS: timeFromUTCDateHHMMSS,
        _setUIControls_induceGraphWithHops: _setUIControls_induceGraphWithHops,
        ui_actions: ui_actions
    };
}])









// app.factory('ui_events', function($http, ui_api_call) {
// 	// change to ui_set
//   var ui_events = {

//     _setEntityList: function() {
//       var endpoint = ui_api_call.endpoints.getNodeList;

//       var promise = ui_api_call.api.testApi(endpoint);

//       // $http returns a promise, which has a then function, which also returns a promise
//       // var promise = $http.get(endpoint).then(function (response) {

//       //   // The return value gets picked up by the then in the controller.
//       //   return response.data;
//       // });
//       // Return the promise to the controller
//       return promise;
//     },

//    _setUIControls_induceGraphWithHops: function(networkViewInfo, params) {

//     var endpoint = ui_api_call.endpoints.induceGraphWithHops;

//     // var promise = $http.get(endpoint).then(function (response) {
//     // 	return response.data;
//     // });

//     // return promise;
// 	var promise = ui_api_call.api.testApi(endpoint, networkViewInfo, params);
//     // var promise = ui_api_call.api.testAPi(endpoint, );
//     return promise;
//     },

//     _setUIControls_genericAPI: function(endpoint, networkViewInfo, nodeIDList, params) {
   
//     	var promise = ui_api_call.api.callApi(endpoint, networkViewInfo, nodeIDList, params);

//     	return promise;
//     },

//     _setUIControls_downloadModal: function(ctx) {
  		
//   		 // var ctx = $scope.ctrlnetworks.canvas.getContext();
//          var dataURL = ctx.canvas.toDataURL();
//          window.open(dataURL);
//          var config = { responseType: 'blob' };

//       $http.get(dataURL, config)
//         .then(function(result) {
        	
//           var anchor = angular.element('<a/>');
//           var blob = new Blob([result.data], {type: "image/png"});
//           anchor.attr({
//             href: window.URL.createObjectURL(blob),
//             target: '_blank',
//             download: 'networkgraph.png'
//           })[0].click();
//         })
//     },


//     _setUIControls_rearrangeAction: function (network) {


//             var clicked = true // used to ensure on stabilized event only used for this button click
//             var nodes = network.body.nodes;

//             var initialPhysicsSetting = network.physics.options.enabled;

//             for (var nodeID in nodes) {

//                 var node = nodes[nodeID]
//                 node.setOptions({
//                     fixed: { 'y': false, 'x': false }
//                 });


//             }
//             network.setOptions({ physics: true })
//             network.redraw()

//             network.on('stabilized', function(params) {
//                 if (clicked == true) {
//                     // revert network back to physics setting
//                     network.setOptions({ physics: initialPhysicsSetting })
//                     clicked = false
//                 }
           
//         })
//     },


//     _initGraph: function(networkViewInfo) {
//     	var endpoint = ui_api_call.endpoints.initGraph;

//     	var promise = ui_api_call.api.testApi(endpoint, networkViewInfo);

//     	return promise;
//     },



//   };

//   var ui_actions = {

//   	_nodeDoubleClickAction: function(networkViewInfo, nodeIDList, params) {
//         // double click of a node is used to explode the node

//         // var curr_node_pos_dict = JSON.stringify(network.getPositions());
//         // var curr_scale = JSON.stringify(network.getScale());
//         // var curr_viewPos = JSON.stringify(network.getViewPosition());

//         var nodeID = params['nodes']['0'];
//         // console.log('fixing node prior to explode', nodeID)
//         // var node = network.body.nodes[nodeID];
//         // node.setOptions({
//         //     fixed: { 'y': true, 'x': true },
//         //     shadow: { 'enabled': false }
//         // });

//         var explode_node_list = JSON.stringify(params.nodes);
//         console.log('node to explode: ', explode_node_list, typeof params.nodes, typeof explode_node_list);

//         // get the x,y coordinate for each node clicked
//         // this is used to set the initial x,y coordinate of each node that comes from the explosoin
//         // console.log(params.pointer.DOM)

//         // TODO: set physics == on prior to explode, the set physics == prior setting after explode.
//         // first check that double click is on a node
//         if (nodeID) {
//             var endpoint = ui_api_call.endpoints.explodeNodes;

//             // ui_graph_api.callAPI(network,
//             //     endpoint, { node_id_list: explode_node_list, clicked_node_coords: params.pointer.canvas }
//             // );

//         var promise = ui_api_call.api.callApi(endpoint, 
//         	networkViewInfo, nodeIDList, 
//         	{ node_id_list: explode_node_list, clicked_node_coords: params.pointer.canvas });

//         return promise;
//         }
//     },

//     _nodeSingleClickAction: function (network, params) {
//         // single click of a node is used to fix and unfix the position

//         // TODO: add neighorhood highlighting - grey out all network except for selected node/community or node + hops?
//         // like this example but the example doesnt work
//         // https://visjs.org/examples/network/exampleApplications/neighbourhoodHighlight.html

//         // var nodeID = params['nodes']['0'];
//         // var node = network.body.nodes[nodeID];

        

//         this._nodeFixUnfixAction(network, params)
//     },

//     _nodeFixUnfixAction: function(network, params) {
//     	var nodeIDList = params['nodes'];
//         console.log('SINGLE CLICK', nodeIDList);

//         // var node = network.body.nodes[nodeID];
        
//         var fixed_nodes = []
//         var unfixed_nodes = []

//         for (var i = 0; i < nodeIDList.length; i++) {
//             var nodeID = nodeIDList[i];
//             var node = network.body.nodes[nodeID];
//             if (nodeID) {
//                 if (network.body.nodes[nodeID].options.fixed.y) {
//                     fixed_nodes.push(nodeID)
//                 } else {
//                     unfixed_nodes.push(nodeID)
//                 }
//             }
//         }

//         console.log('node fix actions fix-->unfix', fixed_nodes)
//         console.log('node fix actions unfix-->fix', unfixed_nodes)

//         if (fixed_nodes.length > 0) {
//             console.log('SINGLE CLICK', nodeID, 'fixed --> unfixed')
//             node.setOptions({
//                 fixed: { 'y': false, 'x': false },
//                 // shadow: { 'enabled': true, color: '#666666' }
//             });

//             var endpoint = ui_api_call.endpoints.setNodeFix;

//             ui_api_call.api.callAPI(network,
//                 endpoint, { 'node_id_list': JSON.stringify(fixed_nodes), 'to_fix': false }
//             );

//             network.physics.enabled = true;
//             network.physics.startSimulation();
//         }

//         if (unfixed_nodes.length > 0) {
//             console.log('SINGLE CLICK', nodeID, 'Unfixed --> fixed')
//             node.setOptions({
//                 fixed: { 'y': true, 'x': true },
//                 // shadow: { 'enabled': false }
//             });

//             var endpoint = ui_api_call.endpoints.setNodeFix;
//             ui_api_call.api.callAPI(network,
//                 endpoint, { 'node_id_list': JSON.stringify(unfixed_nodes), 'to_fix': true }
//             );

//             network.physics.enabled = true;
//             network.physics.startSimulation();
//         }

//     },

//     _edgeSingleClickAction: function(network, params) {

//         // must get clicked edgeID from params['items'], then get list of transactions for edgeID (because aggregated edges contain >= 1 trxn)
//         // sometimes there are > 1 edgeIDs - this is where edges are merged due to node merge actions
//         // then need to iterate through edgeIDs also
//         // these are vis.js arbitrary edgeIDs - can't use them for any sort of api call
//         // (an alternate method would be to get all data via API rather than local vis.js network object)
//         // TODO: write python api call querying nx object and compare results

//         var edgeList = network.getSelectedEdges();
//         console.log('EDGES:', edgeList)

//         var dispString = ""

//         for (var edgeID of edgeList) {
//             var edgeTrxnInfo = network.body.data.edges._data[edgeID]['trxnData']['trxn_list'].values()

//             for (var trxn of edgeTrxnInfo) {
//                 dispString = dispString + '<p>' + JSON.stringify(trxn) + '</p>'
//                 console.log('display string:', JSON.stringify(trxn))
//             }
//         }

//         var edgeInfoBox = document.getElementById("infoEdgeTransactionList");
//         edgeInfoBox.innerHTML = dispString

//     }






//   };

//   return {ui_events: ui_events,
//   		  ui_actions: ui_actions};
// });