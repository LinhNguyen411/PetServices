from django.db import models
import random
import os
from accounts.models import UserAccount

def get_image_path(instance, filename):
    return os.path.join('customers', str(instance.id), filename)
# Create your models here.
class Customer(models.Model):
    id = models.IntegerField(primary_key=True, editable=False)
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=50)
    address = models.CharField(max_length=255, blank=True, null=True)
    account = models.ForeignKey(UserAccount, blank=True, null=True, default=None, on_delete=models.SET_NULL, related_name='customer_account')
    def save(self, *args, **kwargs):
        if not self.id:
            self.id = self.generate_unique_id()
        super(Customer, self).save(*args, **kwargs)

    def generate_unique_id(self):
        unique_id = random.randint(100000, 999999)
        while Customer.objects.filter(id=unique_id).exists():
            unique_id = random.randint(100000, 999999)
        return unique_id
    def __str__(self):
        return f"{self.name} - {self.phone_number}"