from rest_framework import serializers
from .models import Employee, WorkSchedule

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'first_name', 'last_name', 'phone_number','address']

class WorkScheduleSerializer(serializers.ModelSerializer):
    employee = serializers.ReadOnlyField(source = 'employee.name')
    class Meta:
        model = WorkSchedule
        fields = ['id', 'employee', 'date', 'note']