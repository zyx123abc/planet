app.factory('ui_graph_api', ["$http",function ($http) {
      // api endpoints
  var endpoints = {};

    endpoints.getSessionData = "http://localhost:5000/api/GetSessionData";
    endpoints.getNodeList = "http://localhost:5000/api/GetNodeList";
    endpoints.getUREList = "http://localhost:5000/api/GetUREList";
    endpoints.searchEdgeProperties = "http://localhost:5000/api/SearchEdgeProperties";

    endpoints.getNodeListFromSearchItem = "http://localhost:5000/api/GetNodeListFromSearchItem";

    endpoints.getNetworkTrxnList = "http://localhost:5000/api/GetNetworkTrxnList";

    endpoints.undo = "http://localhost:5000/api/Undo";
    endpoints.redo = "http://localhost:5000/api/Redo";
    endpoints.undoredo = "http://localhost:5000/api/UndoRedo";


    endpoints.resetGraph = "http://localhost:5000/api/ResetGraph";
    endpoints.initGraph = "http://localhost:5000/api/InitGraph";
    endpoints.getGraph = "http://localhost:5000/api/GetGraph";
    endpoints.getNodeProperties = "http://localhost:5000/api/GetNodeProperties";
    endpoints.getEdgeProperties = "http://localhost:5000/api/GetEdgeProperties";
    endpoints.induceGraphWithHops = "http://localhost:5000/api/InduceGraphWithHops"; //TODO: rename
    endpoints.expandGraph = "http://localhost:5000/api/ExpandGraph";
    endpoints.contractGraph = "http://localhost:5000/api/ContractGraph";
    endpoints.explodeNodes = "http://localhost:5000/api/ExplodeNodes";
    endpoints.addNodes = "http://localhost:5000/api/AddNodes";
    endpoints.removeNodes = "http://localhost:5000/api/RemoveNodes";
    endpoints.mergeNodes = "http://localhost:5000/api/MergeNodes";
    endpoints.unmergeNodes = "http://localhost:5000/api/UnmergeNodes";


    endpoints.setDateRange = "http://localhost:5000/api/SetDateRange";
    endpoints.setNodeFix = "http://localhost:5000/api/SetNodeFix";
    endpoints.setViewInfo = "http://localhost:5000/api/SetViewInfo";

  var responses = {}
    responses.resp_boolUpdatedStatus;
    responses.resp_strFocalNodeIDList;
    responses.resp_intNumNodes;
    responses.resp_intNumEdges;
    responses.resp_intNumComponents;
    responses.resp_jsonGraph;
    responses.resp_focal_node_id_list;

    var callAPI = function(network, apiEndpoint, params) {

        // get additional data about the network to pass to api...
        // do this anytime the API is called so that the latest view
        // is stored on server-side session
        // especially needed on page reload/refresh

        axios.defaults.withCredentials = true;

        const axiosWithCookies = axios.create({
            withCredentials: true
        });

        var networkViewInfo = {
            'node_coords': network.getPositions(),
            'curr_scale': network.getScale(),
            'curr_viewPos': network.getViewPosition()
        };

        if (params) {
            params['network_view_info'] = networkViewInfo;
        } else {
            params = { 'network_view_info': networkViewInfo }
        }

        if(('remove' in params)) {
            nodeIDList = params['remove']
            
        } else if (!('node_id_list' in params)) {
            var nodeIDList = network.getSelectedNodes();
            params['node_id_list'] = JSON.stringify(nodeIDList);
        } else {
            nodeIDList = params['node_id_list'] 
        }

        // adding this as hack-fix in instances where server session network becomes misaligned with ui network
        // TODO: in some instances, the session graph becomes misaligned with the UI graph!
        // how can this be resolved? this messes up expand graph - if tries to expand nodes that don't exist in the UI, or it doesn't expand because it thinks nodes exist already
        // var currNodeIDList = Object.keys(ui_elements.networks.re_network.getPositions())
        // params['curr_node_id_list'] = JSON.stringify(currNodeIDList);



        console.log('calling api', apiEndpoint)
        console.log('with params', params)
        console.log('on network:', network)
        console.log('with view:', networkViewInfo)
        console.log('with node id list:', nodeIDList)
        // console.log('with curr node id list:', currNodeIDList)
        axiosWithCookies.get(apiEndpoint, { params: params })
            .then(function(response) {
                console.log('successful!')
                if ('focal_items' in response.data) {
                    network.controlParams.focal_items = response.data['focal_items']
                }
                _updateGraph(network, response.data)

            })
            .catch(function(error) {
                console.log('error: ', error);
            });
    };
    // end call api

        //var _updateGraph = function(response_data) {
    var _updateGraph = function (network, response_data) {
        // called after API response is successful
        // sets response variables based on API response
        // if response requires network refresh, calls draw_network function to do so

        responses.resp_boolUpdatedStatus = response_data.bool_update_status;
        responses.resp_strFocalNodeIDList = response_data.str_focal_node_id_list;
        responses.resp_intNumNodes = response_data.int_num_nodes;
        responses.resp_intNumEdges = response_data.int_num_edges;
        responses.resp_intNumComponents = response_data.int_num_components;
        responses.resp_jsonGraph = response_data.json_graph;
        responses.network_view_info = response_data.network_view_info;

        if (responses.resp_boolUpdatedStatus == true) {
            console.log('redrawing network');
            drawNetwork(responses.resp_jsonGraph, network, responses.network_view_info);
        } else {
            console.log('no need to redraw network');
            network.controlParams.networkViewOptions = responses.network_view_info
        }
    };

    var drawNetwork = function(jsonGraph, network, networkViewOptions) {
        // update network object
        // jsonGraph - jsonified networkx graph to display
        // user_view_position - the current x,y position the user is on
        // user_view_scale - the current scale (zoom) the user is on

        var curr_scale = networkViewOptions.curr_scale
        var curr_view_pos = networkViewOptions.curr_viewPos

        var n = new vis.DataSet(jsonGraph.nodes);

        var e = _getEdges(network, jsonGraph.edges)


        network.controlParams.jsonGraph = jsonGraph
        network.controlParams.networkViewOptions = networkViewOptions
        network.controlParams.allEdges = jsonGraph['edges']
        network.controlParams.allNodes = jsonGraph['nodes']

        var data = { nodes: n, edges: e };
        network.setData(data);
        network.moveTo({ position: curr_view_pos, scale: curr_scale });
        network.redraw()

    };

    var _getEdges = function(network, allEdgeList) {
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
        if (network.controlParams.splitCurrencies == true) {
            var e = e_split_curr
        } else {
            var e = e_all_curr
        }

        return e
    }





    return {

        endpoints: endpoints,
        responses:responses,
        callAPI : callAPI ,
        drawNetwork: drawNetwork
    };
}])


