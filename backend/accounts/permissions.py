from rest_framework.permissions import BasePermission

class IsCustomer(BasePermission):
    def has_permission(self, request, view):
        return request.user.account_type =='c'
    
class IsManager(BasePermission):
    def has_permission(self, request, view):
        return request.user.account_type =='m'
    
class IsEmployee(BasePermission):
    def has_permission(self, request, view):
        return request.user.account_type =='e'