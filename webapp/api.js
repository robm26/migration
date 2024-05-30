async function callApi(action) {
    log(null);
    let apiBase = '';
    if(document.cookie) {
        apiBase = document.cookie.split('=')[1];
    }
    const fullApiPath = apiBase + action;

    const fetchRequest = {
        method: "GET",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
            // "Access-Control-Allow-Headers": "Cache-Control",
            // "Cache-Control": "no-cache"
        }
    };

    const response = await fetch(fullApiPath, fetchRequest);
    let data;
    if(response.ok) {
        data = await response.json();
        // fillGrid(data);
    }
    return data;
}
async function postApi(action, body) {
    log(null);
    let apiBase = '';
    if(document.cookie) {
        apiBase = document.cookie.split('=')[1];
    }
    const fullApiPath = apiBase + action;
    const fetchRequest = {
        method: "POST",
        body: JSON.stringify(body),
        cache: "no-cache",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
    };

    const response = await fetch(fullApiPath, fetchRequest);
    return response;

}

function fillGrid(data, grid, table, tableMetadata) {
    clear(grid);
    log(null);
    let myGrid = document.getElementById(grid);
    myGrid.className = grid;
    if(data.length === 0) {
        log('0 records');
        // const row = myGrid.insertRow(-1);
        // const cell1 = row.insertCell(-1);
        // cell1.className = "gridData";
        // cell1.innerHTML = "0 records";

    }
    // let dataSetType = 'data';
    // if(data.length > 0) {
    //     if(Object.keys(data[0])[0] === 'COLUMN_NAME') {
    //         dataSetType = 'descData';
    //     }
    // }
    data.forEach((item, index) => {
        const cols = Object.keys(item);

        if(index === 1) { // show column names

            const gridHeader = myGrid.createTHead();
            const row0 = gridHeader.insertRow(0);
            cols.forEach((col) => {
                const cell0 = row0.insertCell(-1);
                cell0.className = "gridHeader";
                cell0.innerHTML = col;
            });

            const cellDH = row0.insertCell(-1);
            cellDH.className = "gridData";
            cellDH.innerHTML = '';

        }
        const row = myGrid.insertRow(-1);
        cols.forEach((col) => {
            const cell1 = row.insertCell(-1);
            cell1.className = "gridData";
            cell1.innerHTML = item[col];
        });

        const cellD = row.insertCell(-1);
        cellD.className = "gridData";

        const button = document.createElement("button");
        button.className = "formSubmitButton";
        let ks = JSON.parse(tableMetadata)['Table']['KeySchema'];

        let itemKey = {};
        let pkName = ks[0]['AttributeName'];
        let skName = ks.length > 1 ? ks[1]['AttributeName'] : null;

        itemKey[pkName] =  item[pkName];
        if(skName) {
            itemKey[skName] =  item[skName];
        }
        button.onclick = () => deleteItem(table, itemKey);

        let buttonLabel = "delete";
        button.appendChild(document.createTextNode(buttonLabel));
        cellD.appendChild(button);

        const button2 = document.createElement("button");
        button2.className = "formSubmitButton";

        button2.onclick = () => insertRowForm(table, itemKey, item);

        button2.appendChild(document.createTextNode("update"));
        cellD.appendChild(button2);

    });
}

function tableSchemaGrid(metadata, grid) {

    const ADs = metadata['Table']['AttributeDefinitions'];
    const Ks = metadata['Table']['KeySchema'];
    const keyList = Ks.map((key) => key['AttributeName']);
    let AdTypes = {};
    ADs.map((ad) => {
        AdTypes[ad['AttributeName']] = ad['AttributeType'];
    });

    clear(grid);
    let myGrid = document.getElementById(grid);
    // console.log('in tsg');
    // console.log(JSON.stringify(metadata));
    myGrid.className = grid;

    const row = myGrid.insertRow(-1);

    const cell1 = row.insertCell(-1);
    if(Ks.length>1) {
        cell1.rowSpan = 2;
    }
    cell1.className = "gridData";
    cell1.innerHTML = 'Keys';

    const cell2 = row.insertCell(-1);
    cell2.className = "gridData";
    cell2.innerHTML = Ks[0]['AttributeName'];

    const cell3 = row.insertCell(-1);
    cell3.className = "gridData";
    cell3.innerHTML = AdTypes[Ks[0]['AttributeName']];

    if(Ks.length > 1) {
        const row = myGrid.insertRow(-1);
        const cell = row.insertCell(-1);
        cell.className = "gridData";
        cell.innerHTML = Ks[1]['AttributeName'];

        const cell3 = row.insertCell(-1);
        cell3.className = "gridData";
        cell3.innerHTML = AdTypes[Ks[1]['AttributeName']];
    }

    const row2 = myGrid.insertRow(-1);
    const cell21 = row2.insertCell(-1);
    cell21.rowSpan = ADs.length;
    cell21.className = "gridData";
    cell21.innerHTML = 'Columns';

    ADs.forEach((attr, idx) => {
        if(!keyList.includes(attr['AttributeName'])) {
            const row = myGrid.insertRow(-1);
            const cell = row.insertCell(-1);
            cell.className = "gridData";
            cell.innerHTML = attr['AttributeName'];

            const cell3 = row.insertCell(-1);
            cell3.className = "gridData";
            cell3.innerHTML = AdTypes[attr['AttributeName']];
        }

    });

    // const cell22 = row2.insertCell(-1);
    // cell22.className = "gridData";
    // cell22.innerHTML = ADs.map((attr) => {
    //     return attr['AttributeName']
    // })

}
function formatMetadata (mdata, table) {
    const databaseEngine = Array.isArray(mdata) ? 'SQL' : 'DDB';

    if(databaseEngine === 'DDB') {
        return mdata;
    } else {

        let attributeDefinitions = mdata.map((attr) => {
            return {
                AttributeName: attr['COLUMN_NAME'],
                AttributeType: attr['COLUMN_TYPE']
            }
        });
        let keySchema = mdata.filter((attr) => {
            return attr['COLUMN_KEY'] === 'PRI';
        }).map((attr, index) => {
            return {
                "AttributeName": attr['COLUMN_NAME'],
                "KeyType": index === 0 ? "HASH": "RANGE"
            };
        });

        let metadata = {
            Table: {
                AttributeDefinitions: attributeDefinitions,
                TableName: table,
                KeySchema: keySchema
            }
        };
        return metadata;
    }
}

function clear(element) {
    let myElement = document.getElementById(element);
    myElement.innerHTML = '';

}