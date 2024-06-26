#!/usr/bin/env bash

REGION=us-east-2

ENDPOINTURL=https://dynamodb.$REGION.amazonaws.com
# ENDPOINTURL=http://localhost:8000

OUTPUT=text

# TableList=("DemoTable01" "DemoTable02" "DemoTable03" "DemoTable04")
TableList=("Customers")
TableName=""


if [ $# -gt 0 ]
  then
    TableName=$1
    aws dynamodb create-table --cli-input-json "file://$1.json" --region $REGION --endpoint-url $ENDPOINTURL --output $OUTPUT --query 'TableDescription.TableArn'
  else

    for TableName in "${TableList[@]}"
    do
          aws dynamodb create-table --cli-input-json "file://$TableName.json" --region $REGION --endpoint-url $ENDPOINTURL --output $OUTPUT --query 'TableDescription.TableArn'

    done

fi

echo Table creation in process, please wait...
# await final table creation
aws dynamodb wait table-exists --table-name $TableName --region $REGION --endpoint-url $ENDPOINTURL

