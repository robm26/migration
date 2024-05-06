from chalice.test import Client
from app import app
import json
import os

table_name = 'Customers'
testpath = '/desc_table/' + table_name


def test_index():
    with Client(app) as client:

        response = client.http.get(testpath)
        print()
        print(response.json_body)
        #print(json.dumps(response.json_body, indent=2))


test_index()

