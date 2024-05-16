from rest_framework import serializers
from .models import Customer
from pets.serializers import PetSerializer

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'first_name', 'last_name', 'phone_number','address', 'photo']