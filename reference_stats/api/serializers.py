from rest_framework.serializers import (
                                ModelSerializer,
                                HyperlinkedIdentityField,
                                SerializerMethodField,)

# from accounts.api.serializers import UserDetailSerializer
from ..models import Request, Activation


class ActivationListSerializer(ModelSerializer):
    class Meta:
        model = Activation
        fields = [
            'startdate',
            'expiration',
        ]

class RequestListSerializer(ModelSerializer):
    # url = HyperlinkedIdentityField(
    # view_name='posts-api:detail',
    # lookup_field='slug',
    # )
    user = SerializerMethodField()
    type_of_request = SerializerMethodField()
    medium = SerializerMethodField()
    branch = SerializerMethodField()
    # user = UserDetailSerializer(read_only=True)
    class Meta:
        model = Request
        fields = [
            'id',
            'comment',
            'type_of_request',
            'medium',
            'user',
            'create_date',
            'time_length',
            'over_five',
            'branch',
        ]

    def get_user(self, obj):
        return str(obj.user.username)
    def get_medium(self, obj):
        return str(obj.medium.type)
    def get_type_of_request(self, obj):
        return str(obj.type_of_request.type)
    def get_branch(self, obj):
        return str(obj.branch.name)
    # def get_fieldname(self,obj):
    #     return obj.fieldname.url



class RequestCreateUpdateSerializer(ModelSerializer):
    user = SerializerMethodField(read_only=True)
    # branch=SerializerMethodField(read_only=True)
    class Meta:
        model = Request
        read_only_fields = ('branch',)
        fields = [
            'user',
            'medium',
            'type_of_request',
            'comment',
            # 'time_length',
            'create_date',
            'over_five',
            'branch',
            'id',
        ]
    def get_user(self, obj):
        return str(obj.user.username)
    # def get_branch(self, obj):
    #     return obj.branch

class RequestDetailSerializer(ModelSerializer):
    # user = UserDetailSerializer(read_only=True)
    class Meta:
        model = Request
        # user = SerializerMethodField()
        fields = [
            'id',
            'comment',
            'user',
            'create_date',
            'time_length',
        ]
    def get_user(self, obj):
        return str(obj.user.username)
