from rest_framework import serializers
from .models import ProvideGoods, ServicePackage, ServicePackageDetail, Consignment, ConsignmentDetail, CareDetail,ConsignmentDiary, ConsignmentInvoice
from django.utils import timezone

class ProvideGoodsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProvideGoods
        fields = ['id', 'name', 'price']

class ServicePackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicePackage
        fields = ['id', 'name', 'price']

class ServicePackageDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicePackageDetail
        fields = ['id', 'package', 'goods']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['goods'] = {'id': instance.goods.id, 'name': instance.goods.name, 'price': instance.goods.price}
        return representation

class ConsignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consignment
        fields = ['id', 'date_time_create', 'status', 'employee', 'customer']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['employee'] = {'id': instance.employee.id, 'name': instance.employee.name}
        representation['customer'] = {'id': instance.customer.id, 'name': instance.customer.name, 'phone_number': instance.customer.phone_number}
        now = timezone.now()

        total_days = (now - instance.date_time_create).days + 1
        representation['total_days'] = total_days
        
        return representation

class ConsignmentDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsignmentDetail
        fields = ['id','consignment', 'is_paid', 'pet', 'room', 'package']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['pet'] = {'id': instance.pet.id, 'name': instance.pet.name,'species': instance.pet.species.name, 'photo': 'http://127.0.0.1:8000' + instance.pet.photo.url, 'weight':instance.pet.weight}
        representation['room'] = {'id': instance.room.id, 'name': instance.room.name, 'price': instance.room.price}
        representation['package'] = {'id': instance.package.id, 'name': instance.package.name,'price': instance.package.price}
        date_time_create = instance.consignment.date_time_create
        representation['date_time_create'] = date_time_create

        now = timezone.now()
        total_days = (now - date_time_create).days + 1
        representation['total_days'] = total_days
        if ConsignmentDiary.objects.all().filter(con_detail = instance.id):
            diary = ConsignmentDiary.objects.all().filter(con_detail = instance.id).order_by('-date_time_create')[0]
            representation['last_diary'] = {'date_time_create':diary.date_time_create, 'employee':diary.employee.name, 'content':diary.content}
            if instance.is_paid:
                total_days = ( diary.date_time_create - date_time_create).days + 1
                representation['total_days'] = total_days
        
        return representation

class CareDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareDetail
        fields = ['id', 'con_detail', 'goods', 'employee', 'count']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['goods'] = {'id': instance.goods.id, 'name': instance.goods.name, 'price': instance.goods.price}
        representation['employee'] = {'id': instance.employee.id, 'name': instance.employee.name}
        representation['sub_total'] = instance.goods.price * instance.count

        return representation
    
class ConsignmentDiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsignmentDiary
        fields = ['id', 'con_detail', 'employee','content','date_time_create']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['employee'] = {'id': instance.employee.id, 'name': instance.employee.name}
        return representation

class ConsignmentInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsignmentInvoice
        fields = ['id', 'date_time_create', 'employee', 'con_detail']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['employee'] = {'id': instance.employee.id, 'name': instance.employee.name,'phone_number': instance.employee.phone_number}
        representation['total'] = instance.price

        return representation