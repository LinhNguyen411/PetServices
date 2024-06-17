from django.db import models
import random
from customers.models import Customer
from pets.models import Pet
from services.models import Service
from employees.models import Employee
from booking.models import Room
from django.utils import timezone
import os

STATUS_CHOICES = [
    ("e", "cancel"),
    ("u", "unpaid"),
    ("p", "partpaid"),
    ("a", "allpaid"),
]

class ProvideGoods(models.Model):
    id = models.IntegerField(primary_key=True, editable=False)
    name = models.CharField(max_length=255)
    price = models.FloatField(default=0)

    def save(self, *args, **kwargs):
            if not self.id:
                self.id = self.generate_unique_id()
            super(ProvideGoods, self).save(*args, **kwargs)
    def generate_unique_id(self):
        unique_id = random.randint(100000, 999999)
        while ProvideGoods.objects.filter(id=unique_id).exists():
            unique_id = random.randint(100000, 999999)
        return unique_id

class ServicePackage(models.Model):
    id = models.IntegerField(primary_key=True, editable=False)
    name = models.CharField(max_length=255)
    price = models.FloatField(default=0)

    def save(self, *args, **kwargs):
            if not self.id:
                self.id = self.generate_unique_id()
            super(ServicePackage, self).save(*args, **kwargs)
    def generate_unique_id(self):
        unique_id = random.randint(100000, 999999)
        while ServicePackage.objects.filter(id=unique_id).exists():
            unique_id = random.randint(100000, 999999)
        return unique_id
    
class ServicePackageDetail(models.Model):
    package = models.ForeignKey(ServicePackage, on_delete=models.CASCADE, related_name='package_detail')
    goods = models.ForeignKey(ProvideGoods, on_delete=models.CASCADE, related_name='package_goods')

class Consignment(models.Model):
    id = models.IntegerField(primary_key=True, editable=False)
    date_time_create = models.DateTimeField(default=timezone.now, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="u")
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='employee_consign')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='customer_consign')


    def save(self, *args, **kwargs):
        if not self.id:
            self.id = self.generate_unique_id()
        super(Consignment, self).save(*args, **kwargs)

    def generate_unique_id(self):
        unique_id = random.randint(100000, 999999)
        while Consignment.objects.filter(id=unique_id).exists():
            unique_id = random.randint(100000, 999999)
        return unique_id

class ConsignmentDetail(models.Model):
    id = models.IntegerField(primary_key=True, editable=False)
    is_paid = models.BooleanField(default=False, blank=True)
    consignment = models.ForeignKey(Consignment, on_delete=models.CASCADE, related_name='detail_of_consignment')
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='pet_consignment')
    room = models.ForeignKey(Room , on_delete=models.CASCADE, related_name= 'room_consignment')
    package = models.ForeignKey(ServicePackage, on_delete=models.CASCADE, related_name='package_consign' ,default=None)


    def save(self, *args, **kwargs):
        if not self.id:
            self.id = self.generate_unique_id()
        super(ConsignmentDetail, self).save(*args, **kwargs)

    def generate_unique_id(self):
        unique_id = random.randint(100000000, 999999999)
        while ConsignmentDetail.objects.filter(id=unique_id).exists():
            unique_id = random.randint(100000000, 999999999)
        return unique_id

class CareDetail(models.Model):
    con_detail = models.ForeignKey(ConsignmentDetail, on_delete=models.CASCADE, related_name='care_of_consignment')
    goods = models.ForeignKey(ProvideGoods, on_delete=models.CASCADE, related_name='goods_consign')
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='employee_consign_care', default=None)
    count = models.IntegerField(default=1)

class ConsignmentDiary(models.Model):
    content = models.CharField(max_length=1024)
    con_detail = models.ForeignKey(ConsignmentDetail, on_delete=models.CASCADE, related_name='dairy_of_consignment')
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='employee_consign_diary', default=None)
    date_time_create = models.DateTimeField(default=timezone.now, blank=True)

class ConsignmentInvoice(models.Model):
    id = models.IntegerField(primary_key=True, editable=False)
    date_time_create = models.DateTimeField(default=timezone.now, blank=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='employee_consign_bill')
    con_detail = models.ForeignKey(ConsignmentDetail, on_delete=models.CASCADE, related_name='bill_of_consigment')
    price = models.FloatField(default=0, blank=True)


    def save(self, *args, **kwargs):
        if not self.id:
            self.id = self.generate_unique_id()
        self.price = self.calculate_total_price()
        super(ConsignmentInvoice, self).save(*args, **kwargs)

    def generate_unique_id(self):
        unique_id = random.randint(100000, 999999)
        while ConsignmentInvoice.objects.filter(id=unique_id).exists():
            unique_id = random.randint(100000, 999999)
        return unique_id
    def calculate_total_price(self):
        total_price = 0
        care_details = CareDetail.objects.filter(con_detail=self.con_detail)
        date_time_create = self.con_detail.consignment.date_time_create
        package_price = self.con_detail.package.price
        now = timezone.now()
        total_days = (now - date_time_create).days + 1
        total_price += package_price * total_days
        total_price += self.con_detail.room.price * total_days
        for care_detail in care_details:
            total_price += care_detail.goods.price * care_detail.count
        return total_price