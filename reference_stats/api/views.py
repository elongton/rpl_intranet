from django.db.models import Q
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
                          ActivationListSerializer,)
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

from .permissions import IsOwner
from ..models import Request, Activation


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


class ActivationListAPIView(ListAPIView):
    queryset = Activation.objects.all()
    serializer_class = ActivationListSerializer

class ActivationCreateAPIView(CreateAPIView):
    queryset = Activation.objects.all()
    serializer_class = ActivationListSerializer
    permission_classes = [AllowAny]

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
