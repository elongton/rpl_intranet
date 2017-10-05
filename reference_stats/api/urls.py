from django.conf.urls import url
from django.contrib import admin


from .views import (
    RequestCreateAPIView,
    RequestListAPIView,
    RequestUpdateAPIView,
    RequestDeleteAPIView,
    CreateCSV,
    BigData,
    BigDataChart,
    # RequestDetailAPIView,
)



urlpatterns = [
    url(r'^requests/$', RequestListAPIView.as_view(), name='list'),
    url(r'^requests/create/$', RequestCreateAPIView.as_view(), name='create'),
    # url(r'^(?P<pk>\d+)/$', RequestDetailAPIView.as_view(), name = 'detail'),
    url(r'^(?P<pk>\d+)/edit/$', RequestUpdateAPIView.as_view(), name='update'),
    url(r'^(?P<pk>\d+)/delete/$', RequestDeleteAPIView.as_view(), name='delete'),
    url(r'^requests/csv/(?P<date1>\d{4}-\d{2}-\d{2})/(?P<date2>\d{4}-\d{2}-\d{2})/(?P<branch>[A-Za-z\+\/]+)/$', CreateCSV, name="csv"),
    url(r'^requests/bigdata/(?P<date1>\d{4}-\d{2}-\d{2})/(?P<date2>\d{4}-\d{2}-\d{2})/(?P<branch>[A-Za-z\+\/]+)/$', BigData, name="bigdata"),
    url(r'^requests/bigdatachart/(?P<date1>\d{4}-\d{2}-\d{2})/(?P<date2>\d{4}-\d{2}-\d{2})/(?P<branch>[A-Za-z\+\/]+)/$', BigDataChart, name="bigdatachart"),
]



# url(r'^date-add/(?P<entity_id>\d+)/(?P<date>\d{4}-\d{2}-\d{2})/$', views.date_add, name='date_add'),
