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
    request += "FROM INFORMATION_SCHEMA.COLUMNS WHERE table_schema = 'app_db' "
    request += "AND table_name = '" + table + "' "

    mysql_cur.execute(request)
    result = mysql_cur.fetchall()
    return result


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

