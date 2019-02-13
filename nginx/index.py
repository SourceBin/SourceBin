import sys
import json
from subprocess import call
from os import path
from crontab import CronTab

def log(str):
    print(f'\u001b[35;1m{str}\u001b[0m')
    sys.stdout.flush()

with open('domains.json') as f:
    domains = json.load(f)
    cmd = ['certbot', 'certonly', '--standalone', '-n', '--agree-tos']

    for domain in domains:
        name = domain['name']
        email = domain['email']
        log(f'Creating certificate for "{name}" with email "{email}"')

        args = ['-m', email, '-d', name]
        call(cmd + args)

log('Starting renewal cron job')
cron = CronTab(user=True)
job = cron.new(command='certbot --nginx renew')
job.every().day()
cron.write()
call(['crond'])

log('Starting nginx')
call(['nginx', '-g', 'daemon off;'])
