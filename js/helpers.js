function randomInt(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function generateNodes(size, emptyCells) {
    emptyCells = (emptyCells == undefined) ? false : true

    tmp = Array()
    for (i = 0; i < size; i++) {
        tmp[i] = Array()
    }

    Nodes = tmp
    NodeNames = Array()
    globalCounter = 0

    for (i = 0; i < size; i++) {
        NodeNames.push("x" + (globalCounter++))
        for (j = i; j < size; j++) {
            if (i == j) {
                Nodes[i][j] = -Infinity
                continue
            }
            if (emptyCells) continue

            empty = randomInt(0, 1)

            if (empty != 0) {
                Nodes[i][j] = randomInt(1, 9)
            } else {
                Nodes[i][j] = Infinity
            }
            Nodes[j][i] = Nodes[i][j]
        }
    }
}

function download(data, filename) {
    var file = new Blob([data], { type: "text/text" });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}