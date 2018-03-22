from django.conf.urls import url

from .views import (
    MappingListAPIView,
    TeamListAPIView,
    TeamListUpdateAPIView,
    TeamListCreateAPIView,

    SetupListAPIView,
    SetupCreateAPIView,
    SetupUpdateAPIView,
)

urlpatterns = [
    url(r'^list/$', MappingListAPIView.as_view(), name='mapping_list'),
    url(r'^teamlist/$', TeamListAPIView.as_view(), name='teamlist'),
    url(r'^teamlist/(?P<pk>\d+)/update/$', TeamListUpdateAPIView.as_view(), name='teamlist_update'),
    url(r'^teamlist/create/$', TeamListCreateAPIView.as_view(), name='teamlist_create'),


    url(r'^setuplist/$', SetupListAPIView.as_view(), name='setuplist'),
    url(r'^setup/(?P<pk>\d+)/update/$', SetupUpdateAPIView.as_view(), name='teamlist_update'),
    url(r'^setup/create/$', SetupCreateAPIView.as_view(), name='teamlist_create'),
]
