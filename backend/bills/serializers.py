from rest_framework import serializers
from .models import Bill, BillProductItem, BillServiceItem


class BillProductItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillProductItem
        fields = ['id', 'bill', 'product', 'quantity', 'sub_price']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['product'] = {'id': instance.product.id, 'name': instance.product.name}
        return representation

class BillServiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillServiceItem
        fields = ['id', 'bill', 'service', 'pet', 'sub_price']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['service'] = {'id': instance.service.id, 'name': instance.service.name}
        representation['pet'] = {'id': instance.pet.id, 'name': instance.pet.name}

        return representation
    
class BillSerializer(serializers.ModelSerializer):
    product_items = BillProductItemSerializer(many = True)
    service_items = BillServiceItemSerializer(many = True)
    total_price = serializers.SerializerMethodField(method_name="total")
    class Meta:
        model = Bill
        fields = ['id', 'employee', 'customer', 'status', 'date_created', 'date_paid', 'product_items', 'service_items', 'total_price']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['employee'] = {'id': instance.employee.id, 'name': instance.employee.full_name}
        representation['customer'] = {'id': instance.customer.id, 'name': instance.customer.full_name}

        return representation
    def total(self, bill:Bill):
        return sum([product_item.sub_price for product_item in bill.product_items.all()]) + sum([service_item.sub_price for service_item in bill.service_items.all()])