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

    bin9am = request_objects.filter(create_date__time__lt=datetime.time(9,30,0)).count()
    bin10am = request_objects.filter(create_date__time__gte=datetime.time(9,30,0)).filter(create_date__time__lt=datetime.time(10,30,0)).count()
    bin11am = request_objects.filter(create_date__time__gte=datetime.time(10,30,0)).filter(create_date__time__lt=datetime.time(11,30,0)).count()
    bin12pm = request_objects.filter(create_date__time__gte=datetime.time(11,30,0)).filter(create_date__time__lt=datetime.time(12,30,0)).count()
    bin1pm = request_objects.filter(create_date__time__gte=datetime.time(12,30,0)).filter(create_date__time__lt=datetime.time(13,30,0)).count()
    bin2pm = request_objects.filter(create_date__time__gte=datetime.time(13,30,0)).filter(create_date__time__lt=datetime.time(14,30,0)).count()
    bin3pm = request_objects.filter(create_date__time__gte=datetime.time(14,30,0)).filter(create_date__time__lt=datetime.time(15,30,0)).count()
    bin4pm = request_objects.filter(create_date__time__gte=datetime.time(15,30,0)).filter(create_date__time__lt=datetime.time(16,30,0)).count()
    bin5pm = request_objects.filter(create_date__time__gte=datetime.time(16,30,0)).filter(create_date__time__lt=datetime.time(17,30,0)).count()
    bin6pm = request_objects.filter(create_date__time__gte=datetime.time(17,30,0)).filter(create_date__time__lt=datetime.time(18,30,0)).count()
    bin7pm = request_objects.filter(create_date__time__gte=datetime.time(18,30,0)).filter(create_date__time__lt=datetime.time(19,30,0)).count()
    bin8pm = request_objects.filter(create_date__time__gte=datetime.time(19,30,0)).count()

    response = {
        'bin9am':round(bin9am/dt),
        'bin10am':round(bin10am/dt),
        'bin11am':round(bin11am/dt),
        'bin12pm':round(bin12pm/dt),
        'bin1pm':round(bin1pm/dt),
        'bin2pm':round(bin2pm/dt),
        'bin3pm':round(bin3pm/dt),
        'bin4pm':round(bin4pm/dt),
        'bin5pm':round(bin5pm/dt),
        'bin6pm':round(bin6pm/dt),
        'bin7pm':round(bin7pm/dt),
        'bin8pm':round(bin8pm/dt),
    }
    return JsonResponse(response)


#test streaming httpsresponse

class Echo:
    def write(self, value):
        return value

def some_streaming_csv_view(request):
    # """A view that streams a large CSV file."""
    # Generate a sequence of rows. The range is based on the maximum number of
    # rows that can be handled by a single sheet in most spreadsheet
    # applications.
    rows = (["Row {}".format(idx), str(idx)] for idx in range(65536))
    pseudo_buffer = Echo()
    writer = csv.writer(pseudo_buffer)
    response = StreamingHttpResponse((writer.writerow(row) for row in rows),
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
