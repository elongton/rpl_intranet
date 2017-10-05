import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'reference.settings')

import django
django.setup()
from django.core.management import execute_from_command_line

from django.contrib.auth.models import User
from accounts.models import Profile, Branch
from question_tracker.models import Medium, TypeOfRequest


execute_from_command_line(['manage.py', 'migrate'])
execute_from_command_line(['manage.py', 'makemigrations', 'accounts'])
execute_from_command_line(['manage.py', 'makemigrations', 'question_tracker'])
execute_from_command_line(['manage.py', 'migrate'])

#['medium', pk]
media = [['Email', 3],
         ['Phone', 2],
         ['In Person', 1]]
#['medium', pk]
types = [['Circulation', 3],
         ['Directional', 2],
         ['Reference', 1]]

branches = ['Main',
            'Broad Rock',
            'Hull Street',
            'North Avenue',
            'Ginter Park',
            'Westover Hills',
            'West End',
            'Belmont',
            'East End',]

account_password = 'reading123'
#['account_name', branch_pk]
accounts = [['main-comp', 'Main'],
            ['main-circ', 'Main'],
            ['main-ref', 'Main'],
            ['belmont-circ', 'Belmont'],
            ['east-circ', 'East End'],
            ['west-circ', 'West End'],
            ['westover-circ', 'Westover Hills'],
            ['north-circ', 'North Avenue'],
            # ['hull-circ', 'Hull Street'],
            ['broad-circ', 'Broad Rock'],
            ['ginter-circ', 'Ginter Park'],
            ]

superusers = [['elongton', 'Main', 'Read1ng_1tw0']]




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
#########  CREATE ACCOUNTS  #############
print('------------------')
print('Accounts:\n')
for account in accounts:
    if not User.objects.filter(username=account[0]).exists(): #if the user does not exist
        user = User.objects.create_user(username=account[0], password=account_password)
        user.save()
        profile = Profile.objects.get(user=user)
        profile.branch = Branch.objects.get(name=account[1])
        profile.save()
        print('(ADDED) ' + str(profile.user) + ' - ' + str(profile.branch))
    else: #if the user does exist
        user = User.objects.get(username=account[0])
        profile = Profile.objects.get(user=user)
        print(str(profile.user) + ' - ' + str(profile.branch))

#########  CREATE SUPERUSERS  #############
print('------------------')
print('Superusers:\n')
for account in superusers:
    if not User.objects.filter(username=account[0]).exists(): #if the user does not exist
        user = User.objects.create_user(username=account[0], password=account[2])
        user.is_staff = True
        user.is_superuser = True
        user.save()
        profile = Profile.objects.get(user=user)
        profile.branch = Branch.objects.get(name=account[1])
        profile.save()
        print('(ADDED) ' + str(profile.user) + ' - ' + str(profile.branch))
    else: #if the user does exist
        user = User.objects.get(username=account[0])
        profile = Profile.objects.get(user=user)
        print(str(profile.user) + ' - ' + str(profile.branch))
