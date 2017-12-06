from django.conf.urls import url
from django.contrib import admin


from .views import (
    UserCreateAPIView,
    UserLoginAPIView,
    UserListAPIView,
    UserUpdateAPIView,
    IntranetURLListView,
)



urlpatterns = [
    url(r'^login/$', UserLoginAPIView.as_view(), name='login'),
    url(r'^register/$', UserCreateAPIView.as_view(), name='register'),
    url(r'^$', UserListAPIView.as_view(), name='list'),
    url(r'^(?P<pk>\d+)/edit/$', UserUpdateAPIView.as_view(), name='update'),
    url(r'^urls/$', IntranetURLListView.as_view(), name='urls'),
]



    # url(r'^$', RequestListAPIView.as_view(), name='list'),
    # url(r'^create/$', RequestCreateAPIView.as_view(), name='create'),
    # url(r'^(?P<pk>\d+)/$', RequestDetailAPIView.as_view(), name = 'detail'),
    # url(r'^(?P<pk>\d+)/edit/$', RequestUpdateAPIView.as_view(), name='update'),
    # url(r'^(?P<pk>\d+)/delete/$', RequestDeleteAPIView.as_view(), name='delete'),
