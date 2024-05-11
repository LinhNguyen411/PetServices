from rest_framework import serializers
from .models import Bill, BillProductItem, BillServiceItem

class BillProductItemSerializer(serializers.ModelSerializer):
    product = serializers.ReadOnlyField(source = "product.name")
    class Meta:
        model = BillProductItem
        fields = ['id', 'product', 'quantity', 'sub_price']

class BillServiceItemSerializer(serializers.ModelSerializer):
    service = serializers.ReadOnlyField(source = "service.name")
    pet = serializers.ReadOnlyField(source = "pet.name")
    class Meta:
        model = BillServiceItem
        fields = ['id', 'service', 'pet', 'sub_price']

class BillSerializer(serializers.ModelSerializer):
    product_items = BillProductItemSerializer(many = True)
    service_items = BillServiceItemSerializer(many = True)
    total_price = serializers.SerializerMethodField(method_name='total')
    class Meta:
        model = Bill
        fields = ['id', 'employee', 'customer', 'status', 'date_created','data_paid', 'product_items','service_items','total_price']
    def total(self, bill:Bill):
        return bill.product_items.sub_price + bill.service_items.subprice