
async function insertRowForm(table) {

    clear('grid1');
    clear('tblForm');

    const tableMetadata = await callApi('/desc_table/' + table);

    let myTable = document.getElementById('tblForm');
    myTable.className = 'newItemForm';

    tableMetadata.forEach((item, index) => {
        const cols = Object.keys(item);

        const row = myTable.insertRow(-1);
        let colType = 'string';
        let colName = '';
        let colPrimary = true;

        cols.forEach((col, index2) => {

            if(index2 === 0) {
                const cell1 = row.insertCell(-1);
                cell1.className = "gridData";
                cell1.innerHTML = item[col];
                colName = item[col];
            }
            if(index2 === 1) {
                console.log(item[col]);
                colPrimary = item[col] === 'PRI'; // boolean
            }
            if(index2 === 2) {
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

        const input = document.createElement('input');
        input.type = "text";
        if(colPrimary)  {
            let uniqueNumber = Date.now().toString().slice(4,10);
            input.value = colName + '-' + uniqueNumber;
        } else {
            if(colType === 'int') {input.value = 123; }
            if(colType === 'datetime') {input.value = '2024-06-15'; }
            if(colType === 'string') {input.value = 'abc'; }
        }


        cell3.appendChild(input);

    });

    const rowFinal = myTable.insertRow(-1);
    const cellF1 = document.createElement("td");
    cellF1.colSpan = 3;
    cellF1.className = "formSubmitCell";
    const button = document.createElement("button");
    button.className = "formSubmitButton";

    button.onclick = () => insert({});

    button.appendChild(document.createTextNode("SAVE"));
    cellF1.appendChild(button);
    rowFinal.appendChild(cellF1);
}


async function insert(table, row) {
    console.log('in insert');

    const formItem = document.getElementById('formItem');
    const formData = new FormData(formItem);

    const response = await postApi('/new_record/' + table, formData);

    console.log('insertRow() called for ' + table);
    console.log('row ' + row);
    console.log('response :');
    console.log(response);

}

