from django.contrib import admin
from .models import User, Branch, IntranetURL
from django.contrib.auth.models import Group


# class BranchAdmin(admin.ModelAdmin):
#     list_display = ('name', 'pk')
#
# class UserAdmin(admin.ModelAdmin):
#     list_display = ('username', 'branch')
#
# admin.site.register(User, UserAdmin)
# admin.site.register(Branch, BranchAdmin)


from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .forms import UserAdminChangeForm, UserAdminCreationForm

class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = UserAdminChangeForm
    add_form = UserAdminCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('username', 'branch', 'startup_page', 'calendar_preference', 'admin')
    list_filter = ('admin',)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('branch', 'startup_page', 'calendar_preference', 'calendar_condensed_view','tileview','email')}),
        ('Permissions', {'fields': ('admin','is_superuser', 'staff')}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2')}
        ),
    )
    search_fields = ('username',)
    ordering = ('username',)
    filter_horizontal = ()


admin.site.register(User, UserAdmin)
admin.site.register(Branch)
admin.site.register(IntranetURL)

admin.site.unregister(Group) #not using this.
