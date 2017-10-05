from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    message = 'You must be the owner of this object.'
    my_safe_method = ['GET', 'PUT']
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

    # def has_permission(self, request, view):
    #     membership.objects.get(user=request.user)
    #     return obj.user == request.user

        # if request.method in self.my_safe_method:
        #     return True
        # return False
    # def has_object_permission(self, request, view, obj):
    #     #membership.objects.get(user=request.user)
    #     #member.is_active
    #     if request.method in self.my_safe_method:
    #         return True
    #     return obj.user == request.user
