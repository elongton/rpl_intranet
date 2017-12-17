from django.db.models import Q
# from django.utils.decorators import method_decorator
# from django.views.decorators.csrf import csrf_exempt
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
from rest_framework.views import APIView
from .serializers import (RequestCreateUpdateSerializer,
                          RequestDetailSerializer,
                          RequestListSerializer,)
from rest_framework.filters import (
    SearchFilter,
    OrderingFilter,)
from accounts.models import User
from .pagination import RequestLimitOffsetPagination, RequestPageNumberPagination
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAdminUser,
    IsAuthenticatedOrReadOnly,)
from rest_framework.settings import api_settings
from rest_framework_csv import renderers as r

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

# CreateCSV(request, date1, date2, branch):
class CreateCSV(APIView):
    queryset = Request.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RequestListSerializer

#
# def CreateCSV(request, date1, date2, branch):
#     print('this is working')
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


    # rows = (
    #     ['First row', 'Foo', 'Bar', 'Baz'],
    #     ['Second row', 'A', 'B', 'C', '"Testing"', "Here's a quote"]
    # )
    #
    # # Define a generator to stream data directly to the client
    # def stream():
    #     buffer_ = StringIO()
    #     writer = csv.writer(buffer_)
    #     for row in rows:
    #         writer.writerow(row)
    #         buffer_.seek(0)
    #         data = buffer_.read()
    #         buffer_.seek(0)
    #         buffer_.truncate()
    #         yield data
    #
    # # Create the streaming response  object with the appropriate CSV header.
    # response = StreamingHttpResponse(stream(), content_type='text/csv')
    # response['Content-Disposition'] = 'attachment; filename="somefilename.csv"'

    # return JsonResponse('yes')


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
