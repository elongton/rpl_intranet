from django.conf.urls import url
from django.contrib import admin


from .views import (
    BigData,
    BigDataChart,
    some_streaming_csv_view,
    normal_csv,
)

urlpatterns = [
    url(r'^streamingcsvtest/$',some_streaming_csv_view, name="stream"),
    url(r'^csvtest/$',normal_csv, name="csv"),
    url(r'^bigdata/(?P<date1>\d{4}-\d{2}-\d{2})/(?P<date2>\d{4}-\d{2}-\d{2})/(?P<branch>[A-Za-z\+\/]+)/$', BigData, name="bigdata"),
    url(r'^bigdatachart/(?P<date1>\d{4}-\d{2}-\d{2})/(?P<date2>\d{4}-\d{2}-\d{2})/(?P<branch>[A-Za-z\+\/]+)/$', BigDataChart, name="bigdatachart"),
]
