from rest_framework import serializers
from .models import Employee, WorkSchedule

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'name','role','date_of_joining', 'phone_number','address', 'phone_number', 'status', 'photo', 'account']
    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        
        if 'photo' in validated_data and instance.account:
            instance.account.photo = validated_data['photo']
            instance.account.save()
        
        return instance
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if representation['account']:
            representation['account'] = instance.account.email
        return representation
        

class WorkScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkSchedule
        fields = ['id', 'employee', 'date', 'note', 'start_time', 'end_time']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['employee'] = {'id': instance.employee.id, 'name': instance.employee.name}
        return representation