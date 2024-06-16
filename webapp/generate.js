function generateDDB(tableMetadata, dataset) {
    let config = {
      newDateType:'S'
    };

    let ddbFormat = null;

    let ADs = JSON.parse(tableMetadata)['Table']['AttributeDefinitions'];
    const Ks = JSON.parse(tableMetadata)['Table']['KeySchema'];
    const keyList = Ks.map((key) => key['AttributeName']);

    if(!dataset) {
        const tmdFormatted = {
            "TableName": "abc",
            "KeySchema": [],
            "AttributeDefinitions": [],
            "BillingMode": "PAY_PER_REQUEST"
        };
        tmdFormatted['TableName'] = JSON.parse(tableMetadata)['Table']['TableName'];
        tmdFormatted['KeySchema'] = JSON.parse(tableMetadata)['Table']['KeySchema'];
        // let ADs = JSON.parse(tableMetadata)['Table']['AttributeDefinitions'];
        // const Ks = JSON.parse(tableMetadata)['Table']['KeySchema'];
        // const keyList = Ks.map((key) => key['AttributeName']);

        let newADs = [];
        ADs.forEach((attr, index)=> {
            if(keyList.includes(attr['AttributeName'])) {
                let attrType = attr['AttributeType'].slice(0,3);
                if(attrType === 'int') {
                    newADs.push({"AttributeName": attr["AttributeName"], "AttributeType": "N"});
                }
                if(attrType === 'var') {
                    newADs.push({"AttributeName": attr["AttributeName"], "AttributeType": "S"});
                }
                if(attrType === 'dat') {
                    newADs.push({"AttributeName": attr["AttributeName"], "AttributeType": config['newDateType']});
                }
            }
        });
        tmdFormatted['AttributeDefinitions'] = newADs;
        ddbFormat = tmdFormatted;

    } else { // dataset

        let dataJSON = JSON.parse(dataset);
        ddbFormat = dataJSON.map((item, index) => {
            let newItem = {};
            Object.keys(item).map((attr) => {
                let attrType = ADs.filter((attr2) => attr2['AttributeName'] === attr)[0]['AttributeType'];
                let attrTypeDDB = 'S';

                let attrVal = {};

                if(attrType.slice(0,3) === 'int') {
                    attrTypeDDB = 'N';
                    attrVal[attrTypeDDB] = item[attr];
                }
                if(attrType.slice(0,3) === 'var') {
                    attrTypeDDB = 'S';
                    attrVal[attrTypeDDB] = item[attr];
                }
                if(attrType.slice(0,3) === 'dat') {
                    attrTypeDDB = config.newDateType;
                    if(config.newDateType ===  'N') {
                        const myDate = Date.parse(item[attr]);
                        attrVal[attrTypeDDB] = myDate.toString().slice(0,-3);
                    } else {
                        attrVal[attrTypeDDB] = item[attr];
                    }

                }

                newItem[attr] = attrVal;
            });
            return newItem;
        });
        if(ddbFormat.length === 1) {
            ddbFormat = ddbFormat[0];
        }

    }

    return JSON.stringify(ddbFormat, null, 2);

}