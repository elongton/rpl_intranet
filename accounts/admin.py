from django.contrib import admin
from .models import Profile, Branch
# Register your models here.

class BranchAdmin(admin.ModelAdmin):
    list_display = ('name', 'pk')

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'branch')

admin.site.register(Profile, ProfileAdmin)
admin.site.register(Branch, BranchAdmin)
