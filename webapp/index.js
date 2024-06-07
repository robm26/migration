
const dateConversionType = 'string'; // int

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

}

async function listTables() {
    clear('grid1');
    clear('tblForm');
    document.getElementById('tableCrudButtons').innerHTML = '';
    document.getElementById('generateDiv').className = 'GenHidden';

    let tableListTable = document.getElementById("tableList");
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
        newButton.onclick = () => descTableClick(item);
        cell1.appendChild(newButton);

    });
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


    const resetButton = document.getElementsByClassName('tableButtonActive');
    if(resetButton.length>0) {
        resetButton[0].className = 'tableButton';
    }

    const clickedButton = document.getElementById('btn' + table);
    clickedButton.className = 'tableButtonActive';

    tableSchemaGrid(tableMetadata, 'grid1');

    document.getElementById('generateDiv').className = 'GenVisible';

}

async function scanTable(table) {

    clear('tblForm');
    log(null);

    const scanData = await callApi('/scan_table/' + table);

    document.getElementById('dataset').value = JSON.stringify(scanData);

    const tableMetadata = document.getElementById('tableMetadata').value;

    fillGrid(scanData, 'grid1', table, tableMetadata);

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
    } else {
        document.getElementById('dataset').value = JSON.stringify(responseJSON);
        insertRowForm(table, formValuesJSON, responseJSON[0]);
    }

    return {};
}

function generate() {

    const textBox = document.getElementById('textGen');
    const tableMetadata = document.getElementById('tableMetadata').value;
    const dataset =  document.getElementById('dataset').value;
    console.log('*' + typeof dataset + '*');

    let generateType = 'table';

    if(dataset.length > 0) {
        console.log(dataset);
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

    textBox.value = generateType;
    // textBox.value = JSON.stringify(tmdFormatted, null, 2);

    document.getElementById('generateResults').style.display = 'block';

    // document.getElementById('dataset').value;

    return {};
}

function log(msg, status) {
    let logDiv = document.getElementById('callStatusDiv');
    if(msg) {
        logDiv.style.visibility = 'visible';
    } else {
        logDiv.style.visibility = 'hidden';
    }
    logDiv.innerHTML = msg;
}

