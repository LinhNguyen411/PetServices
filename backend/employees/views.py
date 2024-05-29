from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password

from accounts.models import UserAccount
from accounts.serializers import AccountSerializer
from .models import Employee, WorkSchedule
from .serializers import EmployeeSerializer, WorkScheduleSerializer

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.pagination import PageNumberPagination

import random
import string

def generate_random_number(length):
    numbers = string.digits
    return ''.join(random.choice(numbers) for i in range(length))

def generate_random_password(length):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for i in range(length))

def generate_random_email_with_username(username):
    domains = "petcares.com"
    formatted_username = username.replace(" ", "").lower()
    return formatted_username + generate_random_number(4) + "@" + domains

def generate_random_account_with_username(username):
    account = {
        "name": username,
        "password": generate_random_password(12),
        "email": generate_random_email_with_username(username),
        "is_active": True,
        "account_type": "e"
    }
    return account

class EmployeeViewSet(ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    filter_backends = [SearchFilter,OrderingFilter,DjangoFilterBackend]
    filterset_fields = ['account']
    pagination_class = PageNumberPagination
    search_fields = ['id','name', 'phone_number']
    ordering_fields = ['name', 'date_of_joining']
    @action(detail=True, methods=['POST', 'GET'])
    def account(self, request, pk = None):
        try:
            employee = self.get_object()
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found!"}, status = 404)
        if request.method == 'GET':
            if employee.account:
                account = UserAccount.objects.filter(id = employee.account.id)[0]
                serializer = AccountSerializer(account)
                return Response(serializer.data)
            return Response({"message": "This employee don't have an account"})
        if request.method == 'POST':
            try:
                action = request.data['action']
            except KeyError:
                return Response({"error": "Missing action"}, status=400)

            if action == 'generate_password':
                if not employee.account:
                    return Response({"message": "This employee don't have an account"})
                    
                new_pass = generate_random_password(12)
                account = UserAccount.objects.get(id = employee.account.id)
                account.password = make_password(new_pass)
                account.save()
                return Response({"new_pass": new_pass}, status=200)
            elif action == 'create_account':
                if employee.account:
                    return Response({"error": "This employee already have an account!"}, status=400) 
                account = generate_random_account_with_username(employee.name)
                email = account["email"]
                password = account["password"]
                account["password"] = make_password(password)
                print(employee.photo)
                account["photo"] = employee.photo
                serializer = AccountSerializer(data = account)
                if serializer.is_valid():
                    serializer.save()
                    employee.account = UserAccount.objects.get(email = email)
                    employee.save()
                    return Response({"email": email, "password": password, "message": "This information will be deleted!"}, status=200)
                return Response({"error": "Missing value"}, status=400)
            return Response({"error": "Missing action"}, status=400)
            

    


class WorkScheduleViewSet(ModelViewSet):
    queryset = WorkSchedule.objects.all() 
    serializer_class = WorkScheduleSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee', 'date']
