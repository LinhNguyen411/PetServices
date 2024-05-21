from rest_framework import serializers
from .models import Room, ServiceBooking, SubService, Diary, PetCheckInOut

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'number', 'is_booked']

class ServiceBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceBooking
        fields = ['id', 'date_booked','date_start','stay_days', 'status','customer','pet', 'service','photo']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['customer'] = {'id': instance.customer.id, 'name': instance.customer.name}
        representation['pet'] = {'id': instance.pet.id, 'name': instance.pet.name}
        representation['service'] = {'id': instance.service.id, 'name': instance.service.name}
        return representation
    
class SubServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubService
        fields = ['id', 'service_booking', 'service','status', 'photo']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['service'] = {'id': instance.service.id, 'name': instance.service.name}
        return representation

class DiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Diary
        fields = ['id', 'content', 'employee','booking', 'time']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['employee'] = {'id': instance.employee.id, 'name': instance.employee.name}
        return representation
    
class PetCheckInOutSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetCheckInOut
        fields = ['id', 'date_checked_in', 'emp_checked_in','date_checked_out', 'emp_checked_out','booking','is_picked_up']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['emp_checked_in'] = {'id': instance.emp_checked_in.id, 'name': instance.emp_checked_in.name} if instance.emp_checked_in else instance.emp_checked_in
        representation['emp_checked_out'] = {'id': instance.emp_checked_out.id, 'name': instance.emp_checked_out.name} if instance.emp_checked_out else instance.emp_checked_out
        return representation