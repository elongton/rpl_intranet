from rest_framework.serializers import (
                                ModelSerializer,
                                SerializerMethodField,)
from ..models import CalendarBranchMapping
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
