from rest_framework import serializers
from .models import Pet, Species, Weight

class SpeciesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Species
        fields = ['id', 'name']

class WeightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Weight
        fields = ['id','species', 'weight_range', 'weight_type']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['species'] = {'id': instance.species.id, 'name': instance.species.name}

        return representation

class PetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = ['id', 'name', 'age','owner', 'gender', 'weight', 'species', 'photo']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['species'] = {'id': instance.species.id, 'name': instance.species.name}
        representation['weight'] = {'id': instance.weight.id, 'weight_range': instance.weight.weight_range, 'weight_type': instance.weight.weight_type}
        representation['owner'] = {'id': instance.owner.id, 'name': instance.owner.name}

        return representation