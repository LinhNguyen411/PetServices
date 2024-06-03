from rest_framework import serializers
from .models import Room, ServiceBooking, Diary,SubServiceBooking

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'name', 'is_booked']


class ServiceBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceBooking
        fields = ['id', 'date_booked','date_start','stay_days', 'status','customer','pet', 'service', 'room','note']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['customer'] = {'id': instance.customer.id, 'name': instance.customer.name, 'phone_number': instance.customer.phone_number}
        representation['pet'] = {'id': instance.pet.id, 'name': instance.pet.name, 'species': instance.pet.species.id}
        representation['service'] = {'id': instance.service.id, 'name': instance.service.name, 'price': instance.service.price}
        representation['room'] = {'id': instance.room.id, 'name': instance.room.name}
        return representation

class SubServiceBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubServiceBooking
        fields = ['id', 'booking', 'service','is_completed']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['service'] = {'id': instance.service.id, 'name': instance.service.name, 'price': instance.service.price}
        return representation

class DiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Diary
        fields = ['id', 'content', 'employee','booking', 'time', 'photo']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['employee'] = {'id': instance.employee.id, 'name': instance.employee.name}
        return representation
    
