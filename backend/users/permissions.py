from rest_framework.permissions import BasePermission
class IsAppAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.role == "ADMIN" or request.user.is_superuser)