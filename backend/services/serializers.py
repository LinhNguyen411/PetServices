from rest_framework import serializers
from .models import Service, ServiceSurchanges


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id','name', 'description', 'species']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['species'] = {'id': instance.species.id, 'name': instance.species.name}

        return representation

class ServiceSurchangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceSurchanges
        fields = ['id', 'service', 'weight'] 