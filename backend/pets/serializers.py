from rest_framework import serializers
from .models import Pet, Species

class SpeciesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Species
        fields = ['id', 'name']


class PetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = ['id', 'name', 'age','owner', 'gender', 'weight', 'species', 'photo']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['species'] = {'id': instance.species.id, 'name': instance.species.name}
        representation['owner'] = {'id': instance.owner.id, 'name': instance.owner.name}

        return representation