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
    data_paid = models.DateTimeField(blank=True, default=None, null=True)

class BillServiceItem(models.Model):
    id = id = models.UUIDField(default=uuid.uuid4, primary_key=True,editable=False,unique=True)
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="bill_service")
    pet = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="for_pet")
    
    @property
    def sub_price(self):
        price = ServicePrice.objects.filter(service = self.service, weight = self.pet.weight)
        return price if price else 0


class BillProductItem(models.Model):
    id = id = models.UUIDField(default=uuid.uuid4, primary_key=True,editable=False,unique=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="bill_service")
    quantity = models.IntegerField(default=0)
    
    @property
    def sub_price(self):
        sub_price = self.product.price * self.quantity
        return sub_price