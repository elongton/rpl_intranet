from django.db.models import Q
from rest_framework.filters import (
    SearchFilter,
    OrderingFilter,
)
from rest_framework.generics import (
                    CreateAPIView,
                    DestroyAPIView,
                    ListAPIView,
                    RetrieveAPIView,
                    UpdateAPIView,
                    RetrieveUpdateAPIView,)

from .serializers import (APIListSerializer,)
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAdminUser,
    IsAuthenticatedOrReadOnly,
)
from ..models import RemoteAPI

class RemoteAPIListAPIView(ListAPIView):
    serializer_class = APIListSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name']
    def get_queryset(self, *args, **kwargs):
        queryset_list = RemoteAPI.objects.all()
        name = self.request.GET.get("q")
        if name:
            queryset_list = queryset_list.filter(
                Q(name__iexact=name)
            ).distinct()
        return queryset_list
# class RemoteAPIDetailAPIView(RetrieveAPIView):
#     queryset = RemoteAPI.objects.all()
#     serializer_class = APIDetailSerializer
#     permission_classes = [IsAuthenticated]
