import os
import time, datetime
import json
from chalice import Chalice
import mysql.connector

import boto3
from botocore.exceptions import ClientError

app = Chalice(app_name='migration')
dynamodb_table_name = 'Customers'

region = "us-east-2"
mysql_db = "app_db"
mysql_username = "admin"
mysql_password = ""
mysql_host = ""

if "AWS_DEFAULT_REGION" in os.environ:
    region = os.environ['AWS_DEFAULT_REGION']
if "MYSQL_HOST" in os.environ:
    mysql_host = os.environ['MYSQL_HOST']
if "MYSQL_PASSWORD" in os.environ:
    mysql_password = os.environ['MYSQL_PASSWORD']

mysql_conn = mysql.connector.connect(
  database=mysql_db,
  user=mysql_username,
  password=mysql_password,
  host=mysql_host
)

mysql_cur = mysql_conn.cursor(buffered=True, dictionary=True)

ddb = boto3.client('dynamodb', region_name=region)

@app.route('/', methods=['GET'], cors=True)
def ping():
    return {'ping': 'ok'}

@app.route('/list_customers', methods=['GET'], cors=True)
def list_customers():
    mysql_cur.execute("SELECT * FROM Customers")
    result = mysql_cur.fetchall()
    return format_sql_dataset(result)


@app.route("/add_customer", methods=['POST'], cors=True)
def add_customer():
    new_customer = app.current_request.json_body
#     print('new customer')
#     print(new_customer)
    insert_stmt = 'INSERT INTO Customers '
    insert_stmt += '(cust_id, name, email, city, last_updated, rating) '
    insert_stmt += 'VALUES (%s, %s, %s, %s, %s, %s)'
    insert_values = [new_customer['cust_id'], new_customer['name'], 'pat@yahoo.com', new_customer['city'], '2024-02-01', 710]

    mysql_cur.execute(insert_stmt, insert_values)
    mysql_conn.commit()
#     mysql_cur.close()
#     mysql_conn.close()

    return({"status":"success"})


def format_sql_dataset(dataset):
    formatted_dataset = []
    for index, row in enumerate(dataset):
        formatted_row = {}
        for index2, column_name in enumerate(row.keys()):
            if isinstance(row[column_name], datetime.datetime):
                formatted_row[column_name] = row[column_name].isoformat().replace('T',' ')
            else:
                formatted_row[column_name] = row[column_name]
        formatted_dataset.append(formatted_row)
    return(formatted_dataset)
