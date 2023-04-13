function generateMatrixClick() {
    size = document.getElementById("size").value

    generateNodes(size)
    generateMatrix(size)
}

function generateEmptyMatrixClick() {
    size = document.getElementById("size").value

    generateNodes(size, false)
    generateMatrix(size)
}

function generateMatrix(size) {
    outputTable = document.getElementById("matrix")

    if (size > 10) {
        alert("Большой размер матрицы")
        return
    }

    output = "<tr><td></td>"
    for (i = 0; i < size; i++) {
        output += `<td>${NodeNames[i]}</td>`
    }
    output += "</tr>"

    for (i = 0; i < size; i++) {
        output += `<tr><td>${NodeNames[i]}</td>`
        for (j = 0; j < size; j++) {
            if (i == j) {
                output += `<td><input type="number" disabled style="width:30px"/></td>`
                continue
            }

            value = Nodes[i][j]

            if (value == Infinity) {
                value = ""
            }

            output += `<td><input type="number" min="0" max="9"
            id="cell-${i}-${j}" value="${value}" style="width:30px"
            onchange="clickChangeVal(${j}, ${i}, this.value)" /></td>`
        }
        output += "</tr>"
    }
    outputTable.innerHTML = output

    for (i = 0; i < size; i++) {
        for (j = i + 1; j < size; j++) {
            changeVal(j, i, document.getElementById(`cell-${i}-${j}`).value)
        }
    }

    matrixToGraph()
    fillSelectFrom()
}

function clickChangeVal(i, j, value) {
    changeVal(i, j, value)
    matrixToGraph()
}

function changeVal(i, j, value) {
    if (value < 0 || value == "") {
        value = 0
    }

    Nodes[i][j] = Nodes[j][i] = parseInt(value)
    cell1 = document.getElementById(`cell-${i}-${j}`)
    cell2 = document.getElementById(`cell-${j}-${i}`)
    cell1.value = cell2.value = (value != 0) ? value : ""
}

function fillDijkstraTable(data, dp, fp) {
    output = `<tr>
                <td>Вершина</td>
                <td>Длина по <br>Дейкстре</td>
                <td>Путь по <br>Дейкстре</td>
            </tr>`

    data.forEach(element => {
        output += `
            <tr>
                <td>${element["id"]}</td>
                <td>${element["d_len"]}</td>
                <td><button onclick="${element["d"]}">Показать</button></td>
            </tr>
        `
    });

    document.getElementById("calcTable").innerHTML = output
}

function fillSelectFrom() {
    output = ""
    for (i = 0; i < NodeNames.length; i++) {
        output += `<option value="#${NodeNames[i]}">${NodeNames[i]}</option>`
    }
    document.getElementById("d_from").innerHTML = output
}

// Input event handler
document.getElementById('file-input').addEventListener('change', (e) => {
    const reader = new FileReader()
    reader.addEventListener("load", (event) => {
        data = event.target.result

        rows = data.split("\n")
        rows.pop()
        generateNodes(rows.length)
        generateMatrix(rows.length)
        document.getElementById("size").value = rows.length

        for (ii = 0; ii < rows.length; ii++) {
            cells = rows[ii].split(",")
            cells.pop()
            for (jj = ii; jj < rows.length; jj++) {
                if (ii == jj) continue

                if (cells[jj] == "Infinity")
                    cells[jj] = Infinity

                changeVal(ii, jj, cells[jj])
            }
        }

        matrixToGraph()
    });
    reader.readAsText(e.target.files[0])
});

function d_import() {
    e = document.getElementById('file-input')
    e.click();
    c = new Event("change")
    e.dispatchEvent(c)
}

function d_export() {
    data = ""
    Nodes.forEach(row => {
        row.forEach(cell => {
            data += cell.toString() + ","
        })
        data += "\n"
    });

    download(data, "lab1.txt")
}