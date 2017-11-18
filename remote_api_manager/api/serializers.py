from rest_framework.serializers import (
                                ModelSerializer,
                                SerializerMethodField,)
from ..models import RemoteAPI



class APIListSerializer(ModelSerializer):
    class Meta:
        model = RemoteAPI
        fields = [
            'name',
            'client_id',
            'grant_type',
            'client_secret',
        ]
# class APIDetailSerializer(ModelSerializer):
#     class Meta:
#         model = RemoteAPI
#         fields = [
#             'name',
#             'client_id',
#             'grant_type',
#             'client_secret',
#         ]
