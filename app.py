import os
# import time, datetime
import json
from chalice import Chalice
from chalicelib import mysql_calls as db
# from chalicelib import dynamodb_calls as db
import mysql.connector


import boto3
from botocore.exceptions import ClientError

app = Chalice(app_name='migration')

region = "us-east-2"

if "AWS_DEFAULT_REGION" in os.environ:
    region = os.environ['AWS_DEFAULT_REGION']


@app.route('/', methods=['GET'], cors=True)
def ping():
    return {'ping': 'ok'}


@app.route('/list_tables', methods=['GET'], cors=True)
def list_tables():
    return db.list_tables()


@app.route('/desc_table/{table}', methods=['GET'], cors=True)
def desc_table(table):
    return db.desc_table(table)


@app.route('/scan_table/{table}', methods=['GET'], cors=True)
def desc_table(table):
    return db.scan_table(table)


@app.route("/new_record/{table}", methods=['POST'], cors=True)
def new_record(table):
    return db.new_record(table, app.current_request.json_body)



#     insert_stmt = 'INSERT INTO Customers '
#     insert_stmt += '(cust_id, name, email, city, last_updated, rating) '
#     insert_stmt += 'VALUES (%s, %s, %s, %s, %s, %s)'
#     insert_values = [new_customer['cust_id'], new_customer['name'], 'pat@yahoo.com', new_customer['city'], '2024-02-01', 710]
#
#     mysql_cur.execute(insert_stmt, insert_values)
#     mysql_conn.commit()
# #     mysql_cur.close()
# #     mysql_conn.close()
#
#     return({"status":"success"})
#

# @app.route('/list/{table}', methods=['GET'], cors=True)
# def list_customers(table):
#     request = "SELECT * FROM " + table  + " LIMIT " + str(return_limit)
#     mysql_cur.execute(request)
#     result = mysql_cur.fetchall()
#     return format_sql_dataset(result)
#
#
# @app.route('/list_customers', methods=['GET'], cors=True)
# def list_customers():
#     mysql_cur.execute("SELECT * FROM Customers")
#     result = mysql_cur.fetchall()
#     return format_sql_dataset(result)
#




# @app.route("/add_customer", methods=['POST'], cors=True)
# def add_customer():
#     new_customer = app.current_request.json_body
# #     print('new customer')
# #     print(new_customer)
#     insert_stmt = 'INSERT INTO Customers '
#     insert_stmt += '(cust_id, name, email, city, last_updated, rating) '
#     insert_stmt += 'VALUES (%s, %s, %s, %s, %s, %s)'
#     insert_values = [new_customer['cust_id'], new_customer['name'], 'pat@yahoo.com', new_customer['city'], '2024-02-01', 710]
#
#     mysql_cur.execute(insert_stmt, insert_values)
#     mysql_conn.commit()
# #     mysql_cur.close()
# #     mysql_conn.close()
#
#     return({"status":"success"})
#

# @app.route('/list/{table}', methods=['GET'], cors=True)
# def list_customers(table):
#     request = "SELECT * FROM " + table  + " LIMIT " + str(return_limit)
#     mysql_cur.execute(request)
#     result = mysql_cur.fetchall()
#     return format_sql_dataset(result)
#
#
# @app.route('/list_customers', methods=['GET'], cors=True)
# def list_customers():
#     mysql_cur.execute("SELECT * FROM Customers")
#     result = mysql_cur.fetchall()
#     return format_sql_dataset(result)
#
#


