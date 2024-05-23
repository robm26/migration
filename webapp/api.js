async function callApi(action) {
    let apiBase = '';
    if(document.cookie) {
        apiBase = document.cookie.split('=')[1];
    }
    const fullApiPath = apiBase + action;

    const response = await fetch(fullApiPath, {
        method: "GET"
    });
    let data;
    if(response.ok) {
        data = await response.json();
        // fillGrid(data);
    }
    return data;
}
async function postApi(action, body) {
    let apiBase = '';
    if(document.cookie) {
        apiBase = document.cookie.split('=')[1];
    }
    const fullApiPath = apiBase + action;

    const response = await fetch(fullApiPath, {
        method: "POST",
        body: body
    });
    console.log('form post response');
    console.log(response);


}

function fillGrid(data, grid) {
    clear(grid);
    let myGrid = document.getElementById(grid);
    myGrid.className = grid;
    if(data.length === 0) {
        const row = myGrid.insertRow(-1);
        const cell1 = row.insertCell(-1);
        cell1.className = "gridData";
        cell1.innerHTML = "0 records";

    }
    data.forEach((item, index) => {
        const cols = Object.keys(item);

        if(index === 1) {
            const gridHeader = myGrid.createTHead();
            const row0 = gridHeader.insertRow(0);
            cols.forEach((col) => {
                const cell0 = row0.insertCell(-1);
                cell0.className = "gridHeader";
                cell0.innerHTML = col;
            });

        }
        const row = myGrid.insertRow(-1);
        cols.forEach((col) => {
            const cell1 = row.insertCell(-1);
            cell1.className = "gridData";
            cell1.innerHTML = item[col];
        });

    });


}

function clear(element) {
    let myElement = document.getElementById(element);
    myElement.innerHTML = '';

}