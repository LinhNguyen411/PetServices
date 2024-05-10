from rest_framework import serializers
from .models import Product, Category, Supplier

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ['id', 'name', 'address', 'email', 'phone_number']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id','name']


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.ReadOnlyField(source='category.name')
    species = serializers.ReadOnlyField(source = 'species.name')
    supplier = serializers.ReadOnlyField(source = 'supplier.name')
    class Meta:
        model = Product
        fields = ['id', 'name','category','species','supplier','description','price', 'image', 'slug']