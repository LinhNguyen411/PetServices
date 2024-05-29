from rest_framework import serializers
from .models import ServiceBill, ProductBill, ProductBillItem
from services.models import ServiceSurchanges

class ServiceBillSerializer(serializers.ModelSerializer):
    total = serializers.SerializerMethodField(method_name="get_total")
    class Meta:
        model = ServiceBill
        fields = ['id', 'date_created', 'booking','employee','payment_method', 'total']
    def get_total(self, serviceBill:ServiceBill):
        surchanges = ServiceSurchanges.objects.all()
        total_price = 0
        stay_days = serviceBill.booking.stay_days
        main_service = serviceBill.booking.service
        weight = serviceBill.booking.pet.weight
        surchange = surchanges.filter(service = main_service.id, weight = weight.id)
        total_price += main_service.price * stay_days + (surchange[0].surchange if surchange.exists() == True else 0)
        sub_bookings = serviceBill.booking.sub_booking.all()
        for sub_booking in sub_bookings:
            sub_service = sub_booking.service
            surchange = surchanges.filter(service = sub_service.id, weight = weight.id)
            total_price += main_service.price + (surchange[0].surchange if surchange.exists() == True else 0)
        return total_price


class ProductBillItemSerializer(serializers.ModelSerializer):
    sub_total = serializers.SerializerMethodField(method_name="get_total")
    class Meta:
        model = ProductBillItem
        fields = ['id', 'bill','product', 'quantity', 'sub_total']
    def get_total(self, productBillItem:ProductBillItem):
        return productBillItem.quantity * productBillItem.product.price
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['product'] = {'id': instance.product.id, 'name': instance.product.name, 'price': instance.product.price}

        return representation

class ProductBillSerializer(serializers.ModelSerializer):
    total = serializers.SerializerMethodField(method_name="get_total")
    class Meta:
        model = ProductBill
        fields = ['id', 'date_created','employee','customer', 'total','payment_method']
    def get_total(self, productBill:ProductBill):
        items = productBill.bill_item.all()
        total_price = 0
        for item in items:
            total_price += item.quantity * item.product.price
        return total_price
