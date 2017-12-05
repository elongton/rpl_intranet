from django.db.models import Q
# from django.utils.decorators import method_decorator
# from django.views.decorators.csrf import csrf_exempt

import csv
from django.http import HttpResponse, HttpRequest, StreamingHttpResponse, JsonResponse
from datetime import tzinfo, timedelta
import datetime
from time import time
from django.utils import timezone
import dateutil.parser as dparser

from rest_framework.generics import (
                    CreateAPIView,
                    DestroyAPIView,
                    ListAPIView,
                    RetrieveAPIView,
                    UpdateAPIView,
                    RetrieveUpdateAPIView,)
from .serializers import (RequestCreateUpdateSerializer,
                          RequestDetailSerializer,
                          RequestListSerializer,
                          )
from rest_framework.filters import (
    SearchFilter,
    OrderingFilter,
)

from accounts.models import User
from .pagination import RequestLimitOffsetPagination, RequestPageNumberPagination
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAdminUser,
    IsAuthenticatedOrReadOnly,
)
from .permissions import IsOwner
from ..models import Request


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


def CreateCSV(request, date1, date2, branch):
    # def addCSVrow(r):
    #     if r.over_five == True:
    #         over = 'Yes'
    #     else:
    #         over = 'No'
    #     adjusted_create = timezone.localtime(r.create_date)
    #     writer.writerow([adjusted_create.date(), adjusted_create.time().strftime('%H:%M:%S'),
    #                     r.branch, r.user.username, r.medium, r.type_of_request, over, r.comment])
    #
    # # Create the HttpResponse object with the appropriate CSV header.
    # branch = branch.replace('+', ' ')
    # [startdate, enddate] = datemaker(date1, date2)
    # # detect local timezone
    # response = HttpResponse(content_type='text/csv')
    # response['Content-Disposition'] = 'attachment; filename="requests.csv"'
    # writer = csv.writer(response)
    # writer.writerow(['Date', 'Time', 'Branch', 'User', 'Medium', 'Type', 'Over 5 minutes?', 'Comment'])
    # if branch == "All Branches":
    #     for r in Request.objects.filter(create_date__gt=startdate).filter(create_date__lt=enddate):
    #         addCSVrow(r)
    # else:
    #     for r in Request.objects.filter(branch__name=branch).filter(create_date__gt=startdate).filter(create_date__lt=enddate):
    #         addCSVrow(r)
    #     # http://127.0.0.1:8000/api/requests/csv/2017-07-07/2017-07-29/Broad+Rock/
    # return response
    rows = (
        ['First row', 'Foo', 'Bar', 'Baz'],
        ['Second row', 'A', 'B', 'C', '"Testing"', "Here's a quote"]
    )

    # Define a generator to stream data directly to the client
    def stream():
        buffer_ = StringIO()
        writer = csv.writer(buffer_)
        for row in rows:
            writer.writerow(row)
            buffer_.seek(0)
            data = buffer_.read()
            buffer_.seek(0)
            buffer_.truncate()
            yield data

    # Create the streaming response  object with the appropriate CSV header.
    response = StreamingHttpResponse(stream(), content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="somefilename.csv"'

    return response





class RequestCreateAPIView(CreateAPIView):
    queryset = Request.objects.all()
    serializer_class = RequestCreateUpdateSerializer
    def perform_create(self,serializer):
        serializer.save(user=self.request.user)
        branch = self.request.user.branch
        serializer.save(branch=branch)
        # serializer.save(branch=self.request.)

class RequestListAPIView(ListAPIView):
    # queryset = Request.objects.all()
    serializer_class = RequestListSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['branch']
    #for more filter info, look into the e-commerce 2 project
    # pagination_class = RequestPageNumberPagination#PageNumberPagination


    def get_queryset(self, *args, **kwargs):
        queryset_list = Request.objects.all()
        branch = self.request.GET.get("q")
        date1 = self.request.GET.get("d1")
        date2 = self.request.GET.get("d2")
        if branch:
            queryset_list = queryset_list.filter(
                Q(branch__name__iexact=branch)
                # Q(user__first_name__icontains=query)|
                # Q(user__last_name__icontains=query)
            ).distinct()
        if (date1 and date2):
            [startdate, enddate] = datemaker(date1, date2)
            # print(date1)
            # print(date2)

            queryset_list = queryset_list.filter(
                Q(create_date__gte=startdate),
                Q(create_date__lte=enddate)
            ).distinct()

        return queryset_list



class RequestUpdateAPIView(RetrieveUpdateAPIView):
    queryset = Request.objects.all()
    serializer_class = RequestCreateUpdateSerializer
    permission_classes = [IsOwner]
    # lookup_field = 'slug'
    def perform_update(self,serializer):
        serializer.save(user=self.request.user)
        #email send_email  Try Django 1.8 goes over this.

class RequestDeleteAPIView(DestroyAPIView):
    queryset = Request.objects.all()
    serializer_class = RequestDetailSerializer
    # permission_classes = [IsOwner]
    # lookup_field = 'slug'


    # class RequestDetailAPIView(RetrieveAPIView):
    #     queryset = Request.objects.all()
    #     serializer_class = RequestDetailSerializer
    #     # lookup_field = 'slug'
