from django.contrib import admin
from .models import User, Branch
from django.contrib.auth.models import Group


class BranchAdmin(admin.ModelAdmin):
    list_display = ('name', 'pk')

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'branch')

admin.site.register(User, UserAdmin)
admin.site.register(Branch, BranchAdmin)



admin.site.unregister(Group) #not using this.
