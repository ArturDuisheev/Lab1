var contextMenu = cy.contextMenus({
    menuItems: [
        // Global clicks
        {
            id: 'add-node',
            content: 'Добавить вершину',
            coreAsWell: true,
            onClickFunction: function (e) {
                if (Nodes.length > 9) {
                    alert("Нельзя добавлять больше 10 точек")
                    return
                }

                id = "x" + (Nodes.length)

                var data = {
                    id: id,
                    group: 'nodes'
                };

                var pos = e.position || e.cyPosition;

                addNode(id)

                cy.add({
                    data: data,
                    position: {
                        x: pos.x,
                        y: pos.y
                    }
                });
            }
        },
        // Node clicks
        {
            id: 'add-connection',
            content: 'Соединить с',
            selector: 'node',
            onClickFunction: function (e) {
                target = prompt("Введите имя с кем соединить")
                source = e.target.json()["data"]["id"]

                tid = target[1]
                sid = source[1]

                e.cy.add({
                    group: "edges",
                    data: {
                        id: sid + " " + tid,
                        weight: 1,
                        source: source,
                        target: target,
                    }
                })
                changeVal(tid, sid, 1)
            }
        },
        {
            id: 'delete-node',
            content: 'Удалить вершину',
            selector: 'node',
            onClickFunction: function (e) {
                var target = e.target || e.cyTarget;
                OldNodes = JSON.parse(JSON.stringify(Nodes))
                OldNames = JSON.parse(JSON.stringify(NodeNames))
                removeNode(target.json()["data"]["id"])
                removed = target.remove();
                contextMenu.showMenuItem('undo-last-remove');
            }
        },
        //Edge clicks
        {
            id: 'change-edge-weight',
            content: 'Изменить вес',
            selector: 'edge',
            onClickFunction: function (e) {
                target = e.target || e.cyTarget

                data = target.json()["data"]
                t = data["target"]
                s = data["source"]

                value = parseInt(prompt("Введите новый вес", data["weight"]))

                value = (value <= 0) ? 1 : value

                target.json({
                    data: {
                        weight: value
                    }
                })
                changeVal(t[1], s[1], value)
            }
        },
        {
            id: 'delete-edge',
            content: 'Удалить дугу',
            selector: 'edge',
            onClickFunction: function (e) {
                var target = e.target || e.cyTarget;
                removed = target.remove();
                OldNodes = JSON.parse(JSON.stringify(Nodes))

                data = target.json()["data"]
                t = data["target"]
                s = data["source"]
                changeVal(t[1], s[1], 0)

                contextMenu.showMenuItem('undo-last-remove');
            }
        },
        // Undo
        {
            id: 'undo-last-remove',
            content: 'Отменить удаление',
            selector: 'node, edge',
            show: false,
            coreAsWell: true,
            onClickFunction: function (e) {
                if (removed) {
                    removed.restore();
                    Nodes = JSON.parse(JSON.stringify(OldNodes))
                    NodeNames = JSON.parse(JSON.stringify(OldNames))
                    generateMatrix(Nodes.length)
                }
                contextMenu.hideMenuItem('undo-last-remove');
            },
            hasTrailingDivider: true
        },
    ]
})

function addNode(name) {
    NodeNames.push(name)

    tmp = Array()
    tmp.push()
    for (i = 0; i < Nodes.length; i++) {
        Nodes[i].push()
        tmp.push()
    }
    Nodes.push(tmp)

    generateMatrix(Nodes.length)
}

function removeNode(name) {
    index = NodeNames.findIndex(x => x == name)
    NodeNames = NodeNames.filter(e => { return e !== name })

    Nodes.splice(index, 1)
    for (i = 0; i < Nodes.length; i++) {
        Nodes[i].splice(index, 1)
    }

    generateMatrix(Nodes.length)
}