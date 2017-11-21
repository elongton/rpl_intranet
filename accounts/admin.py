from django.contrib import admin
from .models import User, Branch
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
from .forms import UserAdminCreationForm, UserAdminChangeForm

class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = UserAdminChangeForm
    add_form = UserAdminCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('username', 'branch')
    list_filter = ('admin',)
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal info', {'fields': ('branch',)}),
        ('Permissions', {'fields': ('admin','is_superuser', 'staff')}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2')}
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()


admin.site.register(User, UserAdmin)
admin.site.register(Branch)

admin.site.unregister(Group) #not using this.
