from django.contrib import admin
from .models import User, Branch


class BranchAdmin(admin.ModelAdmin):
    list_display = ('name', 'pk')

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'branch')

admin.site.register(User, UserAdmin)
admin.site.register(Branch, BranchAdmin)
