from rest_framework import serializers
from .models import Employee, WorkSchedule

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'first_name', 'last_name','role', 'phone_number','address', 'photo']

class WorkScheduleSerializer(serializers.ModelSerializer):
    employee = serializers.ReadOnlyField(source = 'employee.name')
    class Meta:
        model = WorkSchedule
        fields = ['id', 'employee', 'date', 'note']