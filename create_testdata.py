import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rpl_intranet.settings')

import django
django.setup()

import random
from django.utils import timezone
from datetime import datetime
from calendar import Calendar

from django.contrib.auth.models import User
from reference_stats.models import Request, TypeOfRequest, Medium
from accounts.models import Profile, Branch
from faker import Faker

fakegen = Faker()

cal = Calendar()


def add_requests(N=2, iteryear=2017, itermonth=10): #N is the number of requests per day

    totaldays = 0
    for day in cal.itermonthdates(iteryear, itermonth):
        totaldays = totaldays+1

    totalusers = 0
    for profile in Profile.objects.all():
        if profile.user.is_superuser == False:
            totalusers = totalusers+1

    total_entries = totaldays * totalusers * N
    current_entry = 0
    for day in cal.itermonthdates(iteryear, itermonth):
        for profile in Profile.objects.all():
            if profile.user.is_superuser == False:
                for entry in range(N):
                    current_entry = current_entry+1
                    print(str(current_entry) + ' of ' + str(total_entries))
                    #create a random time on this day
                    hour = random.randint(8, 17)
                    minute = random.randint(0, 59)
                    second = random.randint(0, 59)
                    raw_date = datetime.strptime(str(day), '%Y-%m-%d')
                    final_date = timezone.now()
                    final_date = final_date.replace(hour=hour, minute=minute,
                                                    second=second, day = raw_date.day,
                                                    month = raw_date.month, year = raw_date.year)
                    #decide if the request gets a comment
                    if bool(random.getrandbits(1)):
                        comment = fakegen.text()
                    else:
                        comment = ''
                    # user = 4
                    type_of_request =  random.randint(1, 3)
                    medium = random.randint(1, 3)
                    branch = profile.branch
                    over_five = bool(random.getrandbits(1))
                    request_maker = Request.objects.get_or_create(
                            user = profile.user,
                            time_length = 1,
                            type_of_request = TypeOfRequest.objects.get(pk=type_of_request),
                            medium = Medium.objects.get(pk=medium),
                            comment = comment,
                            branch = branch,
                            create_date = final_date,
                            over_five = over_five,
                    )

print("Populating script!")
add_requests(2)
print("Populating complete!")


# for day in cal.itermonthdates(2017, 7):
#     date = day
# #     date = date.replace(minute=11, hour=23)
# #     print(date)
#
# date = datetime.strptime(str(date), '%Y-%m-%d')
# newdate = date.replace(hour=11, minute=59)
# print(newdate.month)


# type_of_request =  random.randint(1, 3)
# print(type_of_request)

# branch = Profile.objects.get(pk=user).branch.pk
# # branch = Profile.objects.get(pk=3).user.username
# print(branch)

# for profile in Profile.objects.all():
#     print(str(profile.pk) + " - " + str(profile.user.username))
    # print (profile.branch.name)
    # print (profile.user.username)
