# Implementation of application's MySQL database calls
import os
import time, datetime
import mysql.connector

mysql_host = ""
mysql_db = "app_db"
mysql_username = "admin"
mysql_password = ""

return_limit = 20


if "MYSQL_HOST" in os.environ:
    mysql_host = os.environ['MYSQL_HOST']
if "MYSQL_DB" in os.environ:
    mysql_db = os.environ['MYSQL_DB']
if "MYSQL_USERNAME" in os.environ:
    mysql_username = os.environ['MYSQL_USERNAME']
if "MYSQL_PASSWORD" in os.environ:
    mysql_password = os.environ['MYSQL_PASSWORD']


mysql_conn = mysql.connector.connect(
  database=mysql_db,
  user=mysql_username,
  password=mysql_password,
  host=mysql_host
)
mysql_conn.autocommit = True

mysql_cur = mysql_conn.cursor(buffered=True, dictionary=True)

def engine():
    return "MySQL"


def list_tables():
    request = "SELECT table_name FROM information_schema.tables WHERE table_schema = '" + mysql_db + "'"
    mysql_cur.execute(request)
    result = mysql_cur.fetchall()
    tables = []
    for t in result:
        tables.append(t['table_name'])

    return tables


def desc_table(table):
    request = "SELECT COLUMN_NAME, COLUMN_KEY, COLUMN_TYPE "
    request += "FROM INFORMATION_SCHEMA.COLUMNS WHERE table_schema = '" + mysql_db + "' "
    request += "AND table_name = '" + table + "' "

    mysql_cur.execute(request)
    result = mysql_cur.fetchall()
    return result


def scan_table(table):
    limit = 100
    request = "SELECT * "
    request += "FROM " + mysql_db + "." + table + " "
    request += "LIMIT " + str(limit)
    print(request)

    mysql_cur.execute(request)
    result = mysql_cur.fetchall()
    dataset = format_sql_dataset(result)
    print(dataset)

    return dataset


def get_record(table, request):

    keyList = list(request['recordKey'].keys())
    sql_condition = keyList[0] + ' = %s'

    if len(keyList) > 1:
        sql_condition += ' AND ' + keyList[1] + ' = %s'

    key_vals = list(request['recordKey'].values())

    get_stmt = 'SELECT * FROM ' + table + ' WHERE ' + sql_condition

    mysql_cur.execute(get_stmt, key_vals)
    result = mysql_cur.fetchall()
    dataset = format_sql_dataset(result)

    return dataset


def new_record(table, record):
    insert_stmt = 'INSERT INTO ' + table + ' '

    insert_stmt += '(' + ', '.join(list(record)) + ') '
    # If some elements in names aren't strings, use print(', '.join(map(str,name))) instead.
    insert_stmt += 'VALUES (' + ', '.join(["%s"] * len(list(record))) + ') '
    insert_values = list(record.values())

    try:
        mysql_cur.execute(insert_stmt, insert_values)

    except mysql.connector.IntegrityError as ie:
        return({"status": "IntegrityError " + str(ie)})

    return({"status":mysql_cur.rowcount})


def update_record(table, request):

    keyList = list(request['recordKey'].keys())
    delete_condition = keyList[0] + ' = %s'

    if len(keyList) > 1:
        delete_condition += ' AND ' + keyList[1] + ' = %s'

    key_vals = list(request['recordKey'].values())

    update_attributes = list(request['updateAttributes'])
    ua_keys = list(request['updateAttributes'].keys())
    ua_vals = list(request['updateAttributes'].values())

    vals = ua_vals + key_vals

    update_stmt = 'UPDATE ' + table + ' SET '

    for ua_key in ua_keys:
        update_stmt += ua_key + ' = %s, '
    update_stmt = update_stmt[:-2] + ' '

    update_stmt += 'WHERE ' + delete_condition

    mysql_cur.execute(update_stmt, vals)

    return({"status": mysql_cur.rowcount})


def delete_record(table, recordKey):
    keyList = list(recordKey.keys())
    deleteCondition = keyList[0] + ' = %s'

    if len(keyList) > 1:
        deleteCondition += ' AND ' + keyList[1] + ' = %s'

    key_vals = list(recordKey.values())

    delete_stmt = 'DELETE FROM ' + table + ' '

    delete_stmt += 'WHERE ' + deleteCondition
    print(delete_stmt)

    mysql_cur.execute(delete_stmt, key_vals)

    return({"status":mysql_cur.rowcount})

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

