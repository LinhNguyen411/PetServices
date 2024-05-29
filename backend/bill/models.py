from django.db import models
import random
from datetime import datetime
from employees.models import Employee
from booking.models import ServiceBooking
from products.models import Product
from customers.models import Customer

PAYMENT_CHOICES = [
    ('on', 'online'),
    ('off', 'offline')
]
# Create your models here.
class ServiceBill(models.Model):
    id = models.IntegerField(primary_key=True, editable=False)
    date_created = models.DateTimeField(default=datetime.now, blank=True)
    booking = models.ForeignKey(ServiceBooking, on_delete=models.PROTECT, related_name='booking_bill')
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='create_booking_bill')
    payment_method = models.CharField(max_length=20,choices=PAYMENT_CHOICES, default='on')

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = self.generate_unique_id()
        super(ServiceBill, self).save(*args, **kwargs)

    def generate_unique_id(self):
        unique_id = random.randint(100000, 999999)
        while ServiceBill.objects.filter(id=unique_id).exists():
            unique_id = random.randint(100000, 999999)
        return unique_id


class ProductBill(models.Model):
    id = models.IntegerField(primary_key=True, editable=False)
    date_created = models.DateTimeField(default=datetime.now, blank=True)
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='create_product_bill')
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name='buy' ,default=None)
    payment_method = models.CharField(max_length=20,choices=PAYMENT_CHOICES, default='on')

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = self.generate_unique_id()
        super(ProductBill, self).save(*args, **kwargs)

    def generate_unique_id(self):
        unique_id = random.randint(100000, 999999)
        while ProductBill.objects.filter(id=unique_id).exists():
            unique_id = random.randint(100000, 999999)
        return unique_id

class ProductBillItem(models.Model):
    bill = models.ForeignKey(ProductBill, on_delete=models.PROTECT, related_name='bill_item')
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name='product_item')
    quantity = models.IntegerField(default=1)