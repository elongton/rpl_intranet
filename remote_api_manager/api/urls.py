from django.conf.urls import url

from .views import (
    RemoteAPIListAPIView,
)

urlpatterns = [
    url(r'^list/', RemoteAPIListAPIView.as_view(), name='list'),
]


# (?P<branch>[A-Za-z\+\/]+)/$
