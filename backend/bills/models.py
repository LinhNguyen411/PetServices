from django.db import models

# Create your models here.
from django.db import models

# Create your models here.
from django.db import models
import uuid
import os
from customers.models import Customer
from employees.models import Employee
from products.models import Product
from services.models import Service, ServicePrice
from pets.models import Pet


class Bill(models.Model):
    id = id = models.UUIDField(default=uuid.uuid4, primary_key=True,editable=False,unique=True)
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT,related_name="created_by")
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT,related_name="created_for")
    status = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)
    date_paid = models.DateTimeField(blank=True, default=None, null=True)

class BillServiceItem(models.Model):
    id = id = models.UUIDField(default=uuid.uuid4, primary_key=True,editable=False,unique=True)
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE, related_name="service_items")
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="bill_service")
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name="for_pet")
    sub_price = models.FloatField(default=0)
    def save(self, *args, **kwargs):
        price = ServicePrice.objects.filter(service = self.service, weight = self.pet.weight)
        self.sub_price = price[0].price if price else 0
        super(BillServiceItem, self).save(*args, **kwargs)


class BillProductItem(models.Model):
    id = id = models.UUIDField(default=uuid.uuid4, primary_key=True,editable=False,unique=True)
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE, related_name="product_items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="bill_service")
    quantity = models.IntegerField(default=0)
    sub_price = models.FloatField(default=0)

    def save(self, *args, **kwargs):
        self.sub_price = self.product.price * self.quantity
        super(BillProductItem, self).save(*args, **kwargs)