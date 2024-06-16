
const dateConversionType = 'string'; // int
const sqlSamples = [
    "SELECT * FROM Customers",
    "SELECT * FROM Products"
];
function setCookie(value) {

    if(typeof value === 'object' || value.length === 0) {
        const apiTitle = document.getElementById('apiTitle');
        // const navtable = document.getElementById('navtable');

        document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });

        apiTitle.style.visibility = 'hidden';
        // console.log('Error: no URL was entered');
    } else {
        let days = 1000;
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = "API1" + "=" + (value || "")  + expires + "; path=/";

    }
    renderNav();
}

async function renderNav() {

    const apiTitle = document.getElementById('apiTitle');
    const bodycontent = document.getElementById('bodycontent');

    if(document.cookie) {
        apiTitle.style.visibility = 'visible';
        cookieVal = document.cookie.split('=')[1]

        apiTitle.innerHTML = cookieVal;

        bodycontent.style.visibility = 'visible';

    } else {
        apiTitle.style.visibility = 'hidden';
        bodycontent.style.visibility = 'hidden';
    }

    const rootTest = await callApi('/'); // smoke test to ensure API responds with {"engine":"xyz"}
    const engine = rootTest['engine'];
    document.getElementById('engine').value = engine;
    document.getElementById('tablesButton').innerText = engine + ' tables';


}

function openTab(tabName) {
    clear('grid1');
    document.getElementById('tableCrudButtons').innerHTML = '';
    document.getElementById('tab').value = tabName;
    let x = document.getElementsByClassName("tab");
    for (let i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";

    let tabs = document.getElementById("tabs").children;
    for(let i=0; i < tabs.length; i++) {
        if(tabs[i].innerHTML === tabName) {
            tabs[i].className = 'tabActive';
        } else {
            tabs[i].className = 'tabInactive';
        }
    }
    if(tabName === 'CRUD') {
        const tableName = document.getElementById('tableName').value;
        if(tableName) {
            descTableClick(tableName);
        }
    }
    if(tabName === 'Querying') {
        descIndexesClick(document.getElementById('tableName').value);
    }

}

async function listTables() {
    clear('grid1');
    clear('tblForm');
    document.getElementById('tableCrudButtons').innerHTML = '';
    document.getElementById('generateDiv').className = 'GenHidden';
    document.getElementById('tableName').value = '';

    let tableListTable = document.getElementById("leftNavTable");
    // let tableDetailsTable = document.getElementById("tableDetailsTable");

    tableListTable.innerHTML = null;
    // tableDetailsTable.innerHTML = null;
    // document.getElementById('generate').innerHTML = null;

    const list = await callApi('/list_tables');

    list.forEach((item, index) => {

        const row = tableListTable.insertRow(-1);
        const cell1 = row.insertCell();

        const newButton = document.createElement('button');
        newButton.textContent = item;
        newButton.className = "tableButton";
        newButton.id = 'btn' + item;

        newButton.onclick = () => tableClickHandler(item);

        cell1.appendChild(newButton);

    });
}
async function tableClickHandler(table) {

    const resetButton = document.getElementsByClassName('tableButtonActive');
    if(resetButton.length>0) {
        resetButton[0].className = 'tableButton';
    }

    const clickedButton = document.getElementById('btn' + table);
    clickedButton.className = 'tableButtonActive';

    if(document.getElementById('tab').value === 'Querying') {
        if(table) {
            await descIndexesClick(table);
        }

    } else {
        await descTableClick(table);
    }
}

async function descTableClick(table) {
    clear('tblForm');
    document.getElementById('dataset').value = null;

    const descTableResult = await callApi('/desc_table/' + table);
    const tableMetadata = formatMetadata(descTableResult, table);
    document.getElementById('tableName').value = table;
    document.getElementById('tableMetadata').value = JSON.stringify(tableMetadata);

    const ADs = tableMetadata['Table']['AttributeDefinitions'];
    const Ks = tableMetadata['Table']['KeySchema'];
    const keyList = Ks.map((key) => key['AttributeName']);
    let AdTypes = {};
    ADs.map((ad) => {
        AdTypes[ad['AttributeName']] = ad['AttributeType'];
    });

    const tableCrudButtons = document.getElementById('tableCrudButtons');
    tableCrudButtons.innerHTML = '';
    const row = tableCrudButtons.insertRow(-1);

    const cell1 = row.insertCell(-1);
    const btn1 = document.createElement('button');
    btn1.textContent = 'SCAN';
    btn1.className = "findButton";
    btn1.id = 'btnScan' + table;
    btn1.onclick = () => scanTable(table);
    cell1.appendChild(btn1);

    const cell3 = row.insertCell(-1);
    cell3.rowSpan=2;
    cell3.className = "getFormCell";

    const getTable = document.createElement('table');

    const getRowPk = getTable.insertRow(-1);
    const getCellPkLabel = getRowPk.insertCell(-1);

    getCellPkLabel.appendChild(document.createTextNode(keyList[0]));
    const getCellPkInput = getRowPk.insertCell(-1);

    const input1 = document.createElement('input');
    input1.type = 'text';
    input1.name = keyList[0];
    input1.className = 'pkFindBox';
    getCellPkInput.appendChild(input1);

    const getCellPkButton = getRowPk.insertCell(-1);
    if(keyList.length > 1) {
        getCellPkButton.rowSpan = 2;
    }

    const btnGet = document.createElement('button');
    btnGet.textContent = 'GET ITEM';
    btnGet.className = "tableButton";
    btnGet.id = 'btnGet' + table;

    btnGet.onclick = () => getItem(table, 'formQuery');

    getCellPkButton.appendChild(btnGet);

    if(keyList.length > 1) {
        const getRowSk = getTable.insertRow(-1);
        const getCellSkLabel = getRowSk.insertCell(-1);

        getCellSkLabel.appendChild(document.createTextNode(keyList[1]));
        const getCellSkInput = getRowSk.insertCell(-1);

        const input2 = document.createElement('input');
        input2.type = 'text';
        input2.name = keyList[1];
        input2.className = 'pkFindBox';
        getCellSkInput.appendChild(input2);

    }

    cell3.appendChild(getTable);

    const row2 = tableCrudButtons.insertRow(-1);
    const cell2 = row2.insertCell(-1);
    const btn2 = document.createElement('button');
    btn2.textContent = 'INSERT';
    btn2.className = "findButton";
    btn2.id = 'btnInsert' + table;
    btn2.onclick = () => insertRowForm(table);
    cell2.appendChild(btn2);

    tableSchemaGrid(tableMetadata, 'grid1');

    document.getElementById('generateDiv').className = 'GenVisible';
    document.getElementById('generateType').innerHTML = 'DynamoDB Table Definition';


}

async function descIndexesClick(table) {
    clear('indexSummary');
    clear('tblForm');
    document.getElementById('dataset').value = null;

    if(table) {

        const descTableResult = await callApi('/desc_table/' + table);
        let tableMetadata = formatMetadata(descTableResult, table);
        document.getElementById('tableName').value = table;
        document.getElementById('tableMetadata').value = JSON.stringify(tableMetadata);
        tableMetadata = JSON.stringify(tableMetadata);

        const idxTable = document.getElementById('indexSummary');

        let indexMetadata = [];
        if (tableMetadata) {
            indexMetadata = JSON.parse(tableMetadata)['Table']['GlobalSecondaryIndexes'];
            // console.log(JSON.stringify(indexMetadata, null, 2));
            indexMetadata.forEach((idxCol, idx) => {
                if (idx === 0) {
                    const row0 = idxTable.insertRow(-1);
                    const cell0 = row0.insertCell();
                    cell0.innerHTML = 'Index Name';
                    cell0.className = "gridHeader";

                    Object.keys(idxCol).forEach((headerCol, colPosition) => {
                        const cell = row0.insertCell();
                        cell.className = colPosition === 0 ? "PKheader" : "SKheader";

                        cell.innerHTML = "Key " + (colPosition + 1);
                    });
                }
                const row = idxTable.insertRow(-1);
                const cell1 = row.insertCell();
                cell1.className = "gridData";
                cell1.innerHTML = idxCol['IndexName'];
                const cell2 = row.insertCell();
                cell2.className = "gridData";
                cell2.innerHTML = idxCol['KeySchema'][0]['AttributeName'];

                const cell3 = row.insertCell();
                cell3.className = "gridData";
                if (idxCol['KeySchema'].length > 1) {
                    cell3.innerHTML = idxCol['KeySchema'][1]['AttributeName'];
                } else {
                    cell3.innerHTML = '';
                }

            });
        }
    }

    const sampleButtonsSpan = document.getElementById('sampleButtons');
    sampleButtonsSpan.innerHTML = '';

    sqlSamples.forEach((sample, idx) => {
        const newButton = document.createElement('button');
        newButton.textContent = 'S' + (idx + 1);
        // newButton.className = "tableButton";
        newButton.onclick = () => updateSQL(sample);
        sampleButtonsSpan.appendChild(newButton);
    });

}

function updateSQL(sql) {
    document.getElementById('sqlText').value = sql;

}
async function scanTable(table) {

    clear('tblForm');
    log(null);

    const scanData = await callApi('/scan_table/' + table);

    document.getElementById('dataset').value = JSON.stringify(scanData);

    const tableMetadata = document.getElementById('tableMetadata').value;

    fillGrid(scanData, 'grid1', table, tableMetadata);
    document.getElementById('generateType').innerHTML = 'Dataset as DynamoDB JSON';

}
async function getItem(table, formName) {
    clear('grid1');
    clear('tblForm');

    const formItem = document.getElementById(formName);
    const formValues = formItem.querySelectorAll( "input" );
    let formValuesJSON = {};

    formValues.forEach((field, idx) => {
        formValuesJSON[field.name] = field.value;
    });
    const request = {"recordKey": formValuesJSON};

    const response = await postApi('/get_record/' + table, request);
    const responseJSON = await response.json();

    if(responseJSON.length === 0) {
        log('item not found');
        document.getElementById('generateDiv').className = 'GenHidden';
        // document.getElementById('dataset').value = '0';
    } else {
        document.getElementById('generateDiv').className = 'GenVisible';
        document.getElementById('dataset').value = JSON.stringify(responseJSON);
        insertRowForm(table, formValuesJSON, responseJSON[0]);
    }
    document.getElementById('generateType').innerHTML = 'Item as DynamoDB JSON';
    return {};
}

function generate() {

    const textBox = document.getElementById('textGen');
    const tableMetadata = document.getElementById('tableMetadata').value;
    const dataset =  document.getElementById('dataset').value;

    let generateType = 'table';

    if(dataset.length > 0) {

        if(JSON.parse(dataset).length === 1) {
            generateType = 'record';
        } else {
            generateType = 'dataset';
        }
    }

    const tmdFormatted = {
        "Table": {
            "TableName": "abc",
            "KeySchema": [],
            "AttributeDefinitions": []
        }
    };
    tmdFormatted['Table']['TableName'] = JSON.parse(tableMetadata)['Table']['TableName'];
    tmdFormatted['Table']['KeySchema'] = JSON.parse(tableMetadata)['Table']['KeySchema'];
    tmdFormatted['Table']['AttributeDefinitions'] = JSON.parse(tableMetadata)['Table']['AttributeDefinitions'];

    const generated = generateDDB(tableMetadata, dataset);
    textBox.value = generated;
    document.getElementById('generateResults').style.display = 'block';

    return {};
}

function copyText() {
    const textGen = document.getElementById('textGen');
    textGen.focus();
    textGen.select();

    try {
        document.execCommand('copy');
        textGen.blur();
    } catch (err) {
        console.log('unable to copy');
    }
    console.log('copied');

}
function log(msg, status) {

    let tab = document.getElementById('tab').value;

    let logDiv;
    if(tab === 'CRUD') {logDiv = document.getElementById('log'); }
    if(tab === 'Querying') {logDiv = document.getElementById('log2');}

    if(msg) {
        logDiv.style.visibility = 'visible';
    } else {
        logDiv.style.visibility = 'hidden';
    }
    logDiv.innerHTML = msg;
}

