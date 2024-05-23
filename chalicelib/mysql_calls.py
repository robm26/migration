# Implementation of application's MySQL database calls
import os
import time, datetime
import mysql.connector

mysql_host = ""
mysql_db = "app_db"
mysql_username = "admin"
mysql_password = ""

return_limit = 10


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

mysql_cur = mysql_conn.cursor(buffered=True, dictionary=True)

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
    limit = 10
    request = "SELECT * "
    request += "FROM " + mysql_db + "." + table + " "
    request += "LIMIT " + str(limit)
    print(request)

    mysql_cur.execute(request)
    result = mysql_cur.fetchall()
    return format_sql_dataset(result)


def new_record(table, record):
    insert_stmt = 'INSERT INTO ' + table + ' '

    print(table)
    insert_stmt += '(' + ', '.join(list(record)) + ') '
    # If some elements in names aren't strings, use print(', '.join(map(str,name))) instead.
    insert_stmt += 'VALUES (' + ', '.join(["%s"] * len(list(record))) + ') '
    # insert_stmt += 'VALUES (' + ', '.join(f'"{w}"' for w in list(record.values())) + ')'
    print(insert_stmt)
    insert_values = list(record.values())

#    print(list(insert_values))
#     insert_stmt += '(cust_id, name, email, city, last_updated, rating) '
#     insert_stmt += 'VALUES (%s, %s, %s, %s, %s, %s)'
#     insert_values = [new_customer['cust_id'], new_customer['name'], 'pat@yahoo.com', new_customer['city'], '2024-02-01', 710]

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

