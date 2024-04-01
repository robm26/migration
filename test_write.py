from chalice.test import Client
from app import app
import json
import time

testpath = '/'

# testpath = '/scan'
# testpath = '/list_customers'
testpath = '/add_customer'

epoch_time = int(time.time())

post_data = {
    'cust_id': 'cust-' + str(epoch_time),
    'name':'Luna',
    'city':'Rangeley'
}


def test_index():
    with Client(app) as client:
        response = client.http.post(
            testpath,
            headers={'Content-Type':'application/json'},
            body=json.dumps(post_data)
        )

        print(json.dumps(response.json_body, indent=2))


test_index()