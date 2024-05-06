

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
    clearGrid();
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
        cell1.className = "gridData";

    });
}

async function descTableClick(table) {

    const resetButton = document.getElementsByClassName('tableButtonActive');
    if(resetButton.length>0) {
        resetButton[0].className = 'tableButton';
    }

    const clickedButton = document.getElementById('btn' + table);
    clickedButton.className = 'tableButtonActive';

    const tableMetadata = await callApi('/desc_table/' + table);

    let tableDetailsTable = document.getElementById("tableDetailsTable");
    tableDetailsTable.innerHTML = null;

    tableMetadata.forEach((col, index) => {

        const attrs = Object.keys(col);

        if(index === 1) {
            const gridHeader = tableDetailsTable.createTHead();
            const row0 = gridHeader.insertRow(0);
            attrs.forEach((col) => {
                const cell0 = row0.insertCell(-1);
                cell0.className = "metadataHeader";
                cell0.innerHTML = col;
            });

        }
        const row = tableDetailsTable.insertRow(-1);
        attrs.forEach((attr) => {
            const cell1 = row.insertCell(-1);
            cell1.className = "metadataData";
            cell1.innerHTML = col[attr];
        });



    });
    // console.log(JSON.stringify(tableMetadata, null, 2));
    // document.getElementById('debug').innerHTML = JSON.stringify(tableMetadata, null, 2);

}