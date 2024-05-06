async function callApi(action) {
    let apiBase = '';
    if(document.cookie) {
        apiBase = document.cookie.split('=')[1];
    }
    const fullApiPath = apiBase + action;

    const response = await fetch(fullApiPath);
    let data;
    if(response.ok) {
        data = await response.json();
        // fillGrid(data);
    }
    return data;
}

function fillGrid(data) {
    clearGrid();
    let grid = document.getElementById("grid");
    data.forEach((item, index) => {
        const cols = Object.keys(item);

        if(index === 1) {
            const gridHeader = grid.createTHead();
            const row0 = gridHeader.insertRow(0);
            cols.forEach((col) => {
                const cell0 = row0.insertCell(-1);
                cell0.className = "gridHeader";
                cell0.innerHTML = col;
            });

        }
        const row = grid.insertRow(-1);
        cols.forEach((col) => {
            const cell1 = row.insertCell(-1);
            cell1.className = "gridData";
            cell1.innerHTML = item[col];
        });

    });

}

function clearGrid() {
    let grid = document.getElementById("grid");
    grid.innerHTML = '';

}