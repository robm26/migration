

function setCookie(value) {
    console.log('value ' + value);

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

function renderNav() {

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

    let tableListTable = document.getElementById("tableList");
    let tableDetailsTable = document.getElementById("tableDetailsTable");

    tableListTable.innerHTML = null;
    tableDetailsTable.innerHTML = null;

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
    const tableCrudButtons = document.getElementById('tableCrudButtons');
    tableCrudButtons.innerHTML = '';
    const row = tableCrudButtons.insertRow(-1);

    const cell1 = row.insertCell(-1);
    const btn1 = document.createElement('button');
    btn1.textContent = 'SCAN';
    btn1.className = "tableButton";
    btn1.id = 'btnScan' + table;
    btn1.onclick = () => scanTable(table);
    cell1.appendChild(btn1);

    const cell2 = row.insertCell(-1);
    const btn2 = document.createElement('button');
    btn2.textContent = 'INSERT';
    btn2.className = "tableButton";
    btn2.id = 'btnInsert' + table;
    btn2.onclick = () => insertRowForm(table);
    cell2.appendChild(btn2);

    const resetButton = document.getElementsByClassName('tableButtonActive');
    if(resetButton.length>0) {
        resetButton[0].className = 'tableButton';
    }

    const clickedButton = document.getElementById('btn' + table);
    clickedButton.className = 'tableButtonActive';

    let AttributeDefinitions = [];
    let KeySchema = [];

    const tableMetadata = await callApi('/desc_table/' + table);

    fillGrid(tableMetadata, 'grid1');

    //
    // let tableDetailsTable = document.getElementById("tableDetailsTable");
    // tableDetailsTable.innerHTML = null;
    //
    //
    //
    //
    // tableMetadata.forEach((col, rowIndex) => {
    //
    //     const attrs = Object.keys(col);
    //
    //     if(rowIndex === 1) {
    //         const gridHeader = tableDetailsTable.createTHead();
    //         const row0 = gridHeader.insertRow(0);
    //         attrs.forEach((col) => {
    //             const cell0 = row0.insertCell(-1);
    //             cell0.className = "metadataHeader";
    //             cell0.innerHTML = col;
    //         });
    //
    //     }
    //     const row = tableDetailsTable.insertRow(-1);
    //     attrs.forEach((attr, attrIndex) => {
    //
    //         const cell1 = row.insertCell(-1);
    //         cell1.className = "metadataData";
    //         cell1.innerHTML = col[attr];
    //     });
    //
    // });

    let tableMetadataJSON = {
        "Table": {
            "TableName": table,
            "AttributeDefinitions": AttributeDefinitions,
            "KeySchema": KeySchema
        }
    };

    // console.log(tableMetadataJSON);

    // console.log(JSON.stringify(tableMetadata, null, 2));
    // document.getElementById('debug').innerHTML = JSON.stringify(tableMetadata, null, 2);

}

async function scanTable(table) {
    // console.log('scanTable() called for ' + table);
    clear('tblForm');

    const scanData = await callApi('/scan_table/' + table);

    fillGrid(scanData, 'grid1');

}


function showSessionStorage() {

    sessionStorage.setItem("lastname", "Smith");
    sessionStorage.setItem("firstname", "Michelle");

    console.log('set lastname: Smith');

    let debug = document.getElementById('debug');

    debug.innerHTML = Object.keys(sessionStorage);
    // sessionStorage.setItem("lastname", "Smith");
    // sessionStorage.getItem("lastname");

}