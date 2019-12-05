var default_graph_options = {
    // "configure": {
    //     enabled: false,
    //     filter: 'nodes,edges',
    //     container: undefined,
    //     showButton: false
    // },
    "autoResize": true,
    "height": '450',
    "width": '100%',

    "edges": {
        smooth: { forceDirection: "none", type: "dynamic", roundness: 0.5 },
        arrows: { to: { enabled: true } },
        color: { inherit: 'both' },
        selectionWidth: 0,
        scaling: {
            min: 0.5,
            max: 4,
            // label: {
            //     enabled: true,
            //     //min: 1,
            //     //max: 100,
            //     //maxVisible: 100,
            //     //drawThreshold: 100
            // },
            // customScalingFunction: function(min, max, total, value) {
            //     // scale the log of the transaction amount (value)
            //     var logVal = Math.log(value)
            //     var logMin = Math.log(min)
            //     var logMax = Math.log(max)

            //     var scale = 1 / (logMax - logMin);
            //     return Math.max(0, (logVal - logMin) * scale);
            // }

            customScalingFunction (min,max,total,value) {
              if (max === min) {
                return 0.5;
              }
              else {
                var scale = 1 / (max - min);
                return Math.max(0,(value - min)*scale);
              }
            } 
        }
    },
    "physics": {
        enabled: true,
        solver: 'repulsion',
        minVelocity: 0.30,
        stabilization: {
            enabled: false,
            onlyDynamicEdges: true
        },
        adaptiveTimestep: true,
        repulsion: {
            centralGravity: 0.005,
            springLength: 75,
        },
        barnesHut: {
            centralGravity: 0,
            springConstant: 0.04,
            springLength: 100,
            avoidOverlap: 0
        }
    },
    "nodes": {
        shapeProperties: {
            interpolation: true
        },
        shape: 'dot', // TODO: use shapes for particular nodes...
        fixed: false,
        font: {
            color: '#ffffff'
        },
        color: {
            border: '#586e75',
            highlight: {border: '#586e75'}
        },

        // scaling: {
        //     min: 2,
        //     max: 20,
        //     label: {
        //         min: 1,
        //         max: 10,
        //         drawThreshold: 1,
        //         maxVisible: 2000
        //     }
        // }

        scaling: {
            min: 10,
            max: 30,
            label: {
                enabled: true,
                min: 10,
                max: 20,
                maxVisible: 2000,
                drawThreshold: 5
            },
            // custom scaling breaks when theres only 1 node..
            // customScalingFunction: function(min, max, total, value) {
            //     // scale the log of the transaction amount (value)
            //     var logVal = Math.log(value)
            //     var logMin = Math.log(min)
            //     var logMax = Math.log(max)

            //     var scale = 1 / (logMax - logMin);
            //     return Math.max(0, (logVal - logMin) * scale);
            // }
        }
    },
    "layout": {
        randomSeed: 191006,
        improvedLayout: true
        // TODO: USE THIS FOR BETTER COMMUNITY SEPARATION, BUT BUG TEST FIRST
        // TODO: could even used improvedLayout=True with Physics=False,
        //   but keep the existing node positions and then animate a transition to new positions
        // TODO: but i think there's a maximum node limit set for this, else it just uses a circle layout
    },
    "interaction": {

        selectable: true,
        multiselect: true,
        hover:true,
        tooltipDelay: 200
    }
};

var ure_network_options = {
                "physics": {
                    enabled: true,
                    solver: 'repulsion',
                    minVelocity: 0.30,
                    stabilization: {
                        enabled: false,
                        onlyDynamicEdges: true
                    },
                    adaptiveTimestep: true,
                    repulsion: {
                        centralGravity: 0.005,
                    },
                    barnesHut: {
                        centralGravity: 0,
                        springConstant: 0.04,
                        springLength: 100,
                        avoidOverlap: 0
                    }
                },
                "nodes": {
                    shapeProperties: {
                        interpolation: true
                    },
                    shape: 'dot', // TODO: use shapes for particular nodes...
                    fixed: false,
                },
                "edges": {
                    smooth: { forceDirection: "none", type: "dynamic", roundness: 0.5 },
                    arrows: { to: { enabled: true } },
                    color: { inherit: 'both' }
                }
        };

var re_controlParams = {
                        'dragMode': false,
                        'dragInProgress': false,
                        'dragCoords': {'x1':0, 'y1':0, 'x2':0, 'y2': 0},
                        // 'showCommunities': true
                        'colorTheme': 'colTheme_default',
                        'splitCurrencies': false,
                        'focal_items': { 
                            'node_list':[],
                            'edge_list':[],
                            're_list':[],
                            'ure_list':[],
                            'trxn_list':[]
                        }
                    }