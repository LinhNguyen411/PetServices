from rest_framework import serializers
from .models import Service, ServicePrice


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id','name', 'description', 'species']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['species'] = {'id': instance.species.id, 'name': instance.species.name}

        return representation

class ServicePriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicePrice
        fields = ['id','service', 'weight', 'price']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['service'] = {'id': instance.service.id, 'name': instance.service.name}
        representation['weight'] = {'id': instance.weight.id, 'weight_range': instance.weight.weight_range, 'weight_type': instance.weight.weight_type}

        return representation