
async function insertRowForm(table, itemKey, existingItem) {

    clear('grid1');
    clear('tblForm');
    log(null);

    let item = existingItem || {};

    // const tableMetadata = await callApi('/desc_table/' + table);
    const tableMetadata = JSON.parse(document.getElementById('tableMetadata').value);

    const AttributeDefinitions = tableMetadata['Table']['AttributeDefinitions'];
    const KeySchema = tableMetadata['Table']['KeySchema'];

    let myTable = document.getElementById('tblForm');
    myTable.className = 'newItemForm';

    let colPrimary = true;

    AttributeDefinitions.forEach((item, index) => {

        if(index >= KeySchema.length) {
            colPrimary = false;
        }
        const cols = Object.keys(item);

        const row = myTable.insertRow(-1);
        let colType = 'string';
        let colName = '';

        cols.forEach((col, index2) => {

            if(index2 === 0) {
                const cell1 = row.insertCell(-1);
                cell1.className = "gridData";
                cell1.innerHTML = item[col];
                colName = item[col];
            }

            if(index2 === 1) {
                const cell2 = row.insertCell(-1);
                cell2.className = "gridData";
                cell2.innerHTML = item[col];
                if(item[col].slice(0, 3) === 'int') {
                    colType = 'int';
                }
                if(item[col].slice(0, 9) === 'datetime') {
                    colType = 'datetime';
                }
            }
        });

        const cell3 = row.insertCell(-1);
        cell3.className = "gridData";

        if(existingItem && itemKey && colName in itemKey) {
            cell3.innerHTML = existingItem[colName];
        } else {
            const input = document.createElement('input');
            input.type = "text";
            input.name = colName;

            if(existingItem && colName in existingItem) {
                input.value = existingItem[colName];
            } else {
                if(colPrimary)  {
                    let uniqueNumber = Date.now().toString().slice(4,10);
                    input.value = colName + '-' + uniqueNumber;
                } else {
                    if(colType === 'int') {input.value = 123; }
                    if(colType === 'datetime') {input.value = '2024-06-15'; }
                    if(colType === 'string') {input.value = 'abc'; }
                }
            }

            cell3.appendChild(input);
        }

    });

    const rowFinal = myTable.insertRow(-1);
    const cellF1 = document.createElement("td");
    cellF1.colSpan = 3;
    cellF1.className = "formSubmitCell";
    const button = document.createElement("button");
    button.className = "formSubmitButton";

    if(existingItem) {  //update
        button.onclick = () => update(table, itemKey,'formItem');
    } else {
        button.onclick = () => insert(table, 'formItem');
    }

    button.appendChild(document.createTextNode("SAVE"));
    cellF1.appendChild(button);
    rowFinal.appendChild(cellF1);
}


async function insert(table, formName) {
    const formItem = document.getElementById(formName);
    const formValues = formItem.querySelectorAll( "input" );
    let formValuesJSON = {};

    formValues.forEach((field, idx) => {
        formValuesJSON[field.name] = field.value;
    });

    const response = await postApi('/new_record/' + table, formValuesJSON);
    const responseJSON = await response.json();

    if(responseJSON['status'] === 1) {
        log('1 record inserted');
    } else {
        log(responseJSON['status']);
    }
}

async function update(table, recordKey, formName) {
    const formItem = document.getElementById(formName);
    const formValues = formItem.querySelectorAll( "input" );
    let formValuesJSON = {};

    formValues.forEach((field, idx) => {
        formValuesJSON[field.name] = field.value;
    });

    const updateRequest = {
        "recordKey": recordKey,
        "updateAttributes": formValuesJSON
    };

    const response = await postApi('/update_record/' + table, updateRequest);
    const responseJSON = await response.json();

    if(responseJSON['status'] === 1) {
        log('1 record written');
    } else {
        log(JSON.stringify(responseJSON));
    }
}

async function deleteItem(table, recordKey) {

    const response = await postApi('/delete_record/' + table, recordKey);
    const responseJSON = await response.json();

    if(responseJSON['status'] === 1) {
        log('1 record deleted');
    } else if(responseJSON['status'] === 0) {
        log('0 records deleted');
    }

}

