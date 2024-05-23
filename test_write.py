from chalice.test import Client
from app import app
import json
import time

testpath = '/'

# testpath = '/scan'
# testpath = '/list_customers'
testpath = '/new_record/Customers'

epoch_time = int(time.time())

post_data = {
    'cust_id': 'cust-' + str(epoch_time),
    'name': 'Standard',
    'email': 'admin@bu.edu',
    'phone': '555-1234',
    'region': 'Northeast',
    'credit_rating': 354,
    'last_updated': '2024-05-22'
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