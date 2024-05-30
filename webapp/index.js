

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
    document.getElementById('tableName').innerHTML = table;

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


    // const cell3 = row.insertCell(-1);
    // const btn3 = document.createElement('button');
    // btn3.textContent = 'GET ITEM';
    // btn3.className = "tableButton";
    // btn3.id = 'btnInsert' + table;
    // btn3.onclick = () => console.log('get item');
    // cell3.appendChild(btn3);

    const resetButton = document.getElementsByClassName('tableButtonActive');
    if(resetButton.length>0) {
        resetButton[0].className = 'tableButton';
    }

    const clickedButton = document.getElementById('btn' + table);
    clickedButton.className = 'tableButtonActive';

    const descTableResult = await callApi('/desc_table/' + table);

    const tableMetadata = formatMetadata(descTableResult, table);

    document.getElementById('tableName').value = table;
    document.getElementById('tableMetadata').value = JSON.stringify(tableMetadata);

    tableSchemaGrid(tableMetadata, 'grid1');

}

async function scanTable(table) {

    clear('tblForm');
    log(null);

    const scanData = await callApi('/scan_table/' + table);
    const tableMetadata = document.getElementById('tableMetadata').value;

    fillGrid(scanData, 'grid1', table, tableMetadata);

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

