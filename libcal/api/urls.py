from django.conf.urls import url

from .views import (
    MappingListAPIView,
)

urlpatterns = [
    url(r'^list/', MappingListAPIView.as_view(), name='list'),
]
