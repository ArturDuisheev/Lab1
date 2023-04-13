var Nodes = Array()
var NodeNames = Array()

var globalCounter = 0

var cy = cytoscape({
    container: document.getElementById("cy"),

    boxSelectionEnabled: false,
    autounselectify: true,

    style: cytoscape.stylesheet()
        .selector("node")
        .style({
            "content": "data(id)",
            "background-color": "#CD8F8F"
        })
        .selector("edge")
        .style({
            "curve-style": "bezier",
            "width": 3,
            "line-color": "#ddd",
            "label": "data(weight)"
        })
        .selector(".selected")
        .style({
            "background-color": "#009900",
            "line-color": "#66CC00",
        })
})



function matrixToGraph() {
    cy.elements().remove();
    size = Nodes.length

    for (i = 0; i < size; i++) {
        cy.add({
            group: "nodes",
            data: { id: NodeNames[i] },
        })
    }

    for (i = 0; i < size; i++) {
        for (j = i + 1; j < size; j++) {
            val = Nodes[i][j]
            if (Math.abs(val) == Infinity || parseInt(val) == 0 || val == "" || isNaN(val)) {
                continue;
            }
            cy.add({
                group: "edges",
                data: {
                    id: i + " " + j,
                    weight: parseInt(val),
                    source: NodeNames[i],
                    target: NodeNames[j],
                }
            })
        }

    }
    redraw()
}

function redraw() {
    cy.layout({
        directed: false,
        fit: true,
        name: "breadthfirst",
        padding: 5,
        roots: "#x1",
        circle: false,
        grid: false,
        spacingFactor: 1,
    }).run();
}

function calculate() {
    from = document.getElementById("d_from").value

    dijPerf = performance.now()
    for (i = 0; i < 500; i++) {
        dij = cy.elements().dijkstra(from, function (edge) {
            return parseInt(edge.data("weight"));
        });
    }
    dijPerf = +(performance.now() - dijPerf).toFixed(5)

    dijTable = Array()

    NodeNames.forEach(node => {
        if ("#" + node == from) return;
        dijTable.push({
            id: node,
            d_len: dij.distanceTo("#" + node),
            d: "selectPathDijkstra('" + from + "', '#" + node + "')",
        })
    });

    fillDijkstraTable(dijTable, dijPerf)
}

function selectPathDijkstra(from, to) {
    resetRed()
    dij = cy.elements().dijkstra(from, function (edge) {
        return parseInt(edge.data("weight"));
    });
    path = dij.pathTo(to).addClass("selected")
}

function resetRed() {
    cy.elements().removeClass('selected');
}