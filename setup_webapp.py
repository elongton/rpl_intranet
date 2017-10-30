import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rpl_intranet.settings')

import django
django.setup()
from django.core.management import execute_from_command_line

from accounts.models import User, Branch
from reference_stats.models import Medium, TypeOfRequest


execute_from_command_line(['manage.py', 'makemigrations', 'accounts'])
# input("Press Enter to continue...")
execute_from_command_line(['manage.py', 'makemigrations', 'reference_stats'])
# input("Press Enter to continue...")
execute_from_command_line(['manage.py', 'migrate'])
input("Press Enter to continue...")


#['medium', pk]
media = [['Email', 3],
         ['Phone', 2],
         ['In Person', 1]]
#['medium', pk]
types = [['Circulation', 3],
         ['Directional', 2],
         ['Reference', 1]]

branches = {'Main':1,
            'Broad Rock':2,
            'Hull Street':3,
            'North Avenue':4,
            'Ginter Park':5,
            'Westover Hills':6,
            'West End':7,
            'Belmont':8,
            'East End':9,}

account_password = 'reading123'
#['account_name', branch_pk]
accounts = [['main-comp', branches['Main']],
            ['pparks', branches['Main']],
            ['main-circ', branches['Main']],
            ['main-ref', branches['Main']],
            ['belmont-circ', branches['Belmont']],
            ['east-circ', branches['East End']],
            ['west-circ', branches['West End']],
            ['westover-circ', branches['Westover Hills']],
            ['north-circ', branches['North Avenue']],
            # ['hull-circ', 'Hull Street'],
            ['broad-circ', branches['Broad Rock']],
            ['ginter-circ', branches['Ginter Park']],
            ]

superusers = [['elongton', branches['Main'], 'Read1ng_1tw0']]


#########  CREATE MEDIUMS  #############
print('------------------')
print('Types of Media:\n')
for medium in media:
    if not Medium.objects.filter(type=medium[0]).exists():
        mymedium = Medium.objects.create(type=medium[0], id=medium[1])
        mymedium.save()
        print('(ADDED) ' + mymedium.type)
    else:
        mymedium = Medium.objects.get(type=medium[0])
        print(mymedium)


#########  CREATE REQUEST TYPES  #############
print('------------------')
print('Types of Requests:\n')
for typeset in types:
    if not TypeOfRequest.objects.filter(type=typeset[0]).exists():
        mytype = TypeOfRequest.objects.create(type=typeset[0], id=typeset[1])
        mytype.save()
        print('(ADDED) ' + mytype.type)
    else:
        mytype = TypeOfRequest.objects.get(type=typeset[0])
        print(mytype)


#########  CREATE BRANCHES  #############
print('------------------')
print('Branches:\n')
for branch in branches:
    if not Branch.objects.filter(name=branch).exists(): #if the user does not exist
        mybranch = Branch.objects.create(name=branch)
        mybranch.save()
        print('(ADDED) ' + mybranch.name)
    else: #if the user does exist
        mybranch = Branch.objects.get(name=branch)
        print(mybranch)


input("Press Enter to continue...")


#########  CREATE ACCOUNTS  #############
print('------------------')
print('Accounts:\n')
for account in accounts:
    if not User.objects.filter(username=account[0]).exists(): #if the user does not exist
        user = User.objects.create_user(username=account[0], password=account_password, branch=account[1])
        user.save()
        print('(ADDED) ' + str(user.username) + ' - ' + str(user.branch))
    else: #if the user does exist
        user = User.objects.get(username=account[0])
        print(str(user) + ' - ' + str(user.branch))

#########  CREATE SUPERUSERS  #############
print('------------------')
print('Superusers:\n')
for account in superusers:
    if not User.objects.filter(username=account[0]).exists(): #if the user does not exist
        user = User.objects.create_superuser(username=account[0], branch= account[1], password=account[2])
        user.save()
        print('(ADDED) ' + str(user) + ' - ' + str(user.branch))
    else: #if the user does exist
        user = User.objects.get(username=account[0])
        print(str(user) + ' - ' + str(user.branch))
