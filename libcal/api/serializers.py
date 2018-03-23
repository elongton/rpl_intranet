from rest_framework.serializers import (
                                ModelSerializer,
                                SerializerMethodField,)
from ..models import CalendarBranchMapping, SetupTeam, SetupComplete
from accounts.models import Branch


class MappingSerializer(ModelSerializer):
    branch = SerializerMethodField()
    class Meta:
        model = CalendarBranchMapping
        fields = [
            'libcal_branch_id',
            'libcal_calendar_id',
            'branch',
        ]
    def get_branch(self, obj):
        return str(obj.branch.name)


class SetupTeamSerializer(ModelSerializer):
    class Meta:
        model = SetupTeam
        fields = [
            'date',
            'team',
            'id',
        ]
        read_only_fields = ('id',)

class SetupTeamUpdateSerializer(ModelSerializer):
    class Meta:
        model = SetupTeam
        fields = [
            'date',
            'team',
            'id',
        ]
        read_only_fields = ('id', 'date')


class SetupSerializer(ModelSerializer):
    class Meta:
        model = SetupComplete
        fields = [
            'date',
            'setup',
            'book_id',
            'id',
        ]

class SetupUpdateSerializer(ModelSerializer):
    class Meta:
        model = SetupComplete
        fields = [
            'date',
            'setup',
            'book_id',
            'id',
        ]
        read_only_fields = ('book_id', 'date', 'id')
