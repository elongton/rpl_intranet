from django.contrib import admin
from .models import CalendarBranchMapping, SetupTeam, SetupComplete
# Register your models here.


admin.site.register(CalendarBranchMapping)
admin.site.register(SetupTeam)
admin.site.register(SetupComplete)
