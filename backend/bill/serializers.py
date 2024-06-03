from rest_framework import serializers
from .models import ServiceBill,Surcharge, ProductBill, ProductBillItem
from booking.models import SubServiceBooking

class SurchargeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Surcharge
        fields = ['id', 'bill', 'reasons', 'price']

class ServiceBillSerializer(serializers.ModelSerializer):
    total = serializers.SerializerMethodField(method_name="get_total")
    class Meta:
        model = ServiceBill
        fields = ['id', 'date_created', 'booking','employee','payment_method', 'total']
    def get_total(self, serviceBill:ServiceBill):
        total_price = 0
        stay_days = serviceBill.booking.stay_days
        main_service = serviceBill.booking.service
        total_price = main_service.price * stay_days
        surcharges = serviceBill.bill_surcharges.all()
        sub_bookings = SubServiceBooking.objects.filter(booking = serviceBill.booking)
        if sub_bookings.exists():
            for sub_booking in sub_bookings:
                if sub_booking.is_completed:
                    total_price += sub_booking.service.price
        for surcharge in surcharges:
            total_price += surcharge.price
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
