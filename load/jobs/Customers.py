
def row_maker(tick):

    pk = 'cust-' + str(tick).rjust(4, '0')

    row = {
        'cust_id': pk,
        'name': 'Company' + tick,
        'email': 'sam@company' + tick + '.com',
        'phone': '508-555-1212',
        'credit_rating': 675,
        'last_updated': '2024-06-02'
    }

    return row


def job_info():
    job_params = {
        'db': 'mysql',
        'table': 'app_db.Customers',
        'row_count': 3,
    }
    return job_params

