from rest_framework import serializers
from .models import Employee, WorkSchedule

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'first_name', 'last_name','role','date_join', 'phone_number','address', 'photo']

class WorkScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkSchedule
        fields = ['id', 'employee', 'date', 'note']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['employee'] = {'id': instance.employee.id, 'name': instance.employee.full_name}

        return representation