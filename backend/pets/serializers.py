from rest_framework import serializers
from .models import Pet, Species, Weight

class SpeciesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Species
        fields = ['id', 'name']

class WeightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Weight
        fields = ['id', 'weight']

class PetSerializer(serializers.ModelSerializer):
    species = serializers.ReadOnlyField(source='species.name')
    weight = serializers.ReadOnlyField(source='weight.weight_range')
    class Meta:
        model = Pet
        fields = ['id', 'name', 'year_of_birth', 'owner', 'gender', 'weight', 'species']