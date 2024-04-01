
def row_maker(tick):

    pk = 'cust-' + str(tick).rjust(4, '0')

    row = {
        'cust_id': pk,
        'name': 'Luna',
        'email': 'luna@dog.com',
        'city': 'Ashland',
        'last_updated': '2024-04-02',
        'rating': tick * 4
    }

    return row


def job_info():
    job_params = {
        'db': 'mysql',
        'table': 'app_db.customers',
        'row_count': 7,
    }
    return job_params
