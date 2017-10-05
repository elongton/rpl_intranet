from django.contrib import admin
from .models import Request, TypeOfRequest, Medium
# Register your models here.


class RequestAdmin(admin.ModelAdmin):
    list_display = ('create_date', 'type_of_request', 'medium', 'over_five', 'branch', 'user')

class MediumAdmin(admin.ModelAdmin):
    list_display = ('type', 'pk')

class TypeOfRequestAdmin(admin.ModelAdmin):
    list_display = ('type', 'pk')

admin.site.register(Medium, MediumAdmin)
admin.site.register(Request, RequestAdmin)
admin.site.register(TypeOfRequest, TypeOfRequestAdmin)
