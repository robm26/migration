import random

def row_maker(tick):

    pk = 'prod-' + str(tick).rjust(4, '0')

    row = {
        'prod_id': pk,
        'name': 'ACME',
        'category': random.choice(products),
        'list_price': 234,
        'last_updated': '2024-06-02'
    }

    return row


def job_info():
    job_params = {
        'db': 'mysql',
        'table': 'app_db.Products',
        'row_count': 10,
    }
    return job_params

products = ['Car', 'Car', 'Car', 'Truck', 'Truck', 'Bike']

def random_string(length=8):
    letters = string.ascii_letters
    return ''.join(random.choice(letters) for i in range(length))