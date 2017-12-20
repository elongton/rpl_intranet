from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, StreamingHttpResponse, JsonResponse
from datetime import tzinfo, timedelta
import datetime
from time import time
from django.utils import timezone
import dateutil.parser as dparser

from .models import Request

import csv

# Create your views here.


def datemaker(date1, date2):
#this function makes a start date 12AM, and end date 11:59PM
    startdate = dparser.parse(date1)
    enddate = dparser.parse(date2)
    generic_date = timezone.localtime(timezone.now())
    startdate = generic_date.replace(hour=0, minute=0,
                                    second=0, day = startdate.day,
                                    month = startdate.month, year = startdate.year)
    enddate = generic_date.replace(hour=23, minute=59,
                                    second=59, day = enddate.day,
                                    month = enddate.month, year = enddate.year)
    return([startdate, enddate])


def BigData(request, date1, date2, branch):
    branch = branch.replace('+', ' ')
    [startdate, enddate] = datemaker(date1, date2)
    request_objects = Request.objects.filter(branch__name=branch).filter(create_date__gt=startdate).filter(create_date__lt=enddate)
    totalquant = request_objects.count()
    circquant = request_objects.filter(type_of_request__type='Circulation').count()
    dirquant = request_objects.filter(type_of_request__type='Directional').count()
    refquant = request_objects.filter(type_of_request__type='Reference').count()
    overfivequant = request_objects.filter(over_five=True).count()

    if totalquant == 0:
        response = {
            'total_quant':0,
            'circ_quant':0,
            'dir_quant':0,
            'ref_quant':0,
            'overfive_quant':0,
        }
    else:
        response = {
            'total_quant':totalquant,
            'circ_quant':circquant,
            'dir_quant':dirquant,
            'ref_quant':refquant,
            'overfive_quant':round(overfivequant/totalquant*100),
        }

    return JsonResponse(response)


def BigDataChart(request, date1, date2, branch):
    branch = branch.replace('+', ' ')
    [startdate, enddate] = datemaker(date1, date2)
    request_objects = Request.objects.filter(branch__name=branch).filter(create_date__gt=startdate).filter(create_date__lt=enddate)

    dt = enddate - startdate
    dt = dt.days

    print(request_objects.first().create_date.minute)

    # bin9am = request_objects.filter(create_date__hour__lt=9, create_date__minute__lt=30).count()
    # bin10am = request_objects.filter(create_date__hour__gte=9, create_date__minute__gte=30).filter(create_date__hour__lt=10, create_date__minute__lt=30).count()
    # bin11am = request_objects.filter(create_date__hour__gte=10, create_date__minute__gte=30).filter(create_date__hour__lt=11, create_date__minute__lt=30).count()
    # bin12pm = request_objects.filter(create_date__hour__gte=11, create_date__minute__gte=30).filter(create_date__hour__lt=12, create_date__minute__lt=30).count()
    # bin1pm = request_objects.filter(create_date__hour__gte=12, create_date__minute__gte=30).filter(create_date__hour__lt=13, create_date__minute__lt=30).count()
    # bin2pm = request_objects.filter(create_date__hour__gte=13, create_date__minute__gte=30).filter(create_date__hour__lt=14, create_date__minute__lt=30).count()
    # bin3pm = request_objects.filter(create_date__hour__gte=14, create_date__minute__gte=30).filter(create_date__hour__lt=15, create_date__minute__lt=30).count()
    # bin4pm = request_objects.filter(create_date__hour__gte=15, create_date__minute__gte=30).filter(create_date__hour__lt=16, create_date__minute__lt=30).count()
    # bin5pm = request_objects.filter(create_date__hour__gte=16, create_date__minute__gte=30).filter(create_date__hour__lt=17, create_date__minute__lt=30).count()
    # bin6pm = request_objects.filter(create_date__hour__gte=17, create_date__minute__gte=30).filter(create_date__hour__lt=18, create_date__minute__lt=30).count()
    # bin7pm = request_objects.filter(create_date__hour__gte=18, create_date__minute__gte=30).filter(create_date__hour__lt=19, create_date__minute__lt=30).count()
    # bin8pm = request_objects.filter(create_date__hour__gte=19, create_date__minute__gte=30).count()
    #
    # response = {
    #     'bin9am':round(bin9am/dt),
    #     'bin10am':round(bin10am/dt),
    #     'bin11am':round(bin11am/dt),
    #     'bin12pm':round(bin12pm/dt),
    #     'bin1pm':round(bin1pm/dt),
    #     'bin2pm':round(bin2pm/dt),
    #     'bin3pm':round(bin3pm/dt),
    #     'bin4pm':round(bin4pm/dt),
    #     'bin5pm':round(bin5pm/dt),
    #     'bin6pm':round(bin6pm/dt),
    #     'bin7pm':round(bin7pm/dt),
    #     'bin8pm':round(bin8pm/dt),
    # }
    response = {'hi':'yo'}
    return JsonResponse(response)


#test streaming httpsresponse

class Echo:
    def write(self, value):
        return value

def generate_csv(request, date1, date2, branch):

    #the goal here is to create the entire array of rows and then iterate over it within the StreamingHttpResponse
    #build array:
    # Create the HttpResponse object with the appropriate CSV header.

    branch = branch.replace('+', ' ')
    [startdate, enddate] = datemaker(date1, date2)


    def addCSVrow(r, array):
        if r.over_five == True:
            over = 'Yes'
        else:
            over = 'No'
        adjusted_create = timezone.localtime(r.create_date)
        array.append([adjusted_create.date(), adjusted_create.time().strftime('%H:%M:%S'),
                        r.branch.name, r.user.username, r.medium.type, r.type_of_request.type, over, r.comment])

    csv_array = [['Date', 'Time', 'Branch', 'User', 'Medium', 'Type', 'Over 5 minutes?', 'Comment']]
    if branch == "All Branches":
        for r in Request.objects.filter(create_date__gt=startdate).filter(create_date__lt=enddate):
            addCSVrow(r, csv_array)
    else:
        for r in Request.objects.filter(branch__name=branch).filter(create_date__gt=startdate).filter(create_date__lt=enddate):
            addCSVrow(r, csv_array)

    pseudo_buffer = Echo()
    writer = csv.writer(pseudo_buffer)
    response = StreamingHttpResponse(
                                     (writer.writerow(row) for row in csv_array),
                                     content_type="text/csv")
    # response['Transfer-Encoding'] = 'chunked'
    response['Content-Disposition'] = 'attachment; filename="somefilename.csv"'
    return response










# def normal_csv(request):
#     # Create the HttpResponse object with the appropriate CSV header.
#     response = HttpResponse(content_type='text/csv')
#     # response['Content-Disposition'] = 'attachment; filename="somefilename.csv"'
#
#     writer = csv.writer(response)
#     rows = (["Row {}".format(idx), str(idx)] for idx in range(100))
#     for row in rows:
#         writer.writerow(row)
#     return response
