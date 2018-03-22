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

from .serializers import (MappingSerializer,
                          SetupTeamSerializer,
                          SetupTeamUpdateSerializer,
                          SetupSerializer,
                          SetupUpdateSerializer,
                          )
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAdminUser,
    IsAuthenticatedOrReadOnly,
)
from ..models import CalendarBranchMapping, SetupTeam, SetupComplete

class MappingListAPIView(ListAPIView):
    serializer_class = MappingSerializer
    # permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['branch']
    def get_queryset(self, *args, **kwargs):
        queryset_list = CalendarBranchMapping.objects.all()
        name = self.request.GET.get("q")
        if name:
            queryset_list = queryset_list.filter(
                Q(name__iexact=name)
            ).distinct()
        return queryset_list



class TeamListAPIView(ListAPIView):
    serializer_class = SetupTeamSerializer
    # permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['date','tileview']
    def get_queryset(self, *args, **kwargs):
        queryset_list = SetupTeam.objects.all()
        date = self.request.GET.get("q")
        tileview = self.request.GET.get("t")
        if date:
            queryset_list = queryset_list.filter(
                Q(date__gte=date)
            ).distinct()
        if date and tileview == 'yes':
            queryset_list = queryset_list.filter(
                Q(date__iexact=date)
            ).distinct()
        return queryset_list


class TeamListCreateAPIView(CreateAPIView):
    serializer_class = SetupTeamSerializer
    permission_classes = [AllowAny]

class TeamListUpdateAPIView(RetrieveUpdateAPIView):
    queryset = SetupTeam.objects.all()
    serializer_class = SetupTeamUpdateSerializer
    permission_classes = [AllowAny]


class SetupListAPIView(ListAPIView):
    serializer_class = SetupSerializer
    # permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['date']
    def get_queryset(self, *args, **kwargs):
        queryset_list = SetupTeam.objects.all()
        date = self.request.GET.get("q")
        tileview = self.request.GET.get("t")
        if date:
            queryset_list = queryset_list.filter(
                Q(date__gte=date)
            ).distinct()
        if date and tileview == 'yes':
            queryset_list = queryset_list.filter(
                Q(date__iexact=date)
            ).distinct()
        return queryset_list

class SetupCreateAPIView(CreateAPIView):
    serializer_class = SetupSerializer
    permission_classes = [AllowAny]

class SetupUpdateAPIView(RetrieveUpdateAPIView):
    queryset = SetupComplete.objects.all()
    serializer_class = SetupUpdateSerializer
    permission_classes = [AllowAny]

# class RemoteAPIDetailAPIView(RetrieveAPIView):
#     queryset = RemoteAPI.objects.all()
#     serializer_class = APIDetailSerializer
#     permission_classes = [IsAuthenticated]
