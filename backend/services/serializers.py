from rest_framework import serializers
from .models import Service, ServicePrice


class ServiceSerializer(serializers.ModelSerializer):
    species = serializers.ReadOnlyField(source = 'species.name')
    class Meta:
        model = Service
        fields = ['id','name', 'description', 'species']

class ServicePriceSerializer(serializers.ModelSerializer):
    service = serializers.ReadOnlyField(source = 'service.name')
    weight = serializers.ReadOnlyField(source = 'weight.weight_range')
    class Meta:
        model = Service
        fields = ['id','service', 'weight', 'price']