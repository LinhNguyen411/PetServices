from rest_framework import serializers
from .models import Product, Category, Supplier
from pets.serializers import SpeciesSerializer

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ['id', 'name', 'address', 'email', 'phone_number']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id','name', 'description']


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name','category','species','supplier','description','price', 'image', 'quantity']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['species'] = {'id': instance.species.id, 'name': instance.species.name}
        representation['category'] = {'id': instance.category.id, 'name': instance.category.name}
        representation['supplier'] = {'id': instance.supplier.id, 'name': instance.supplier.name}

        return representation