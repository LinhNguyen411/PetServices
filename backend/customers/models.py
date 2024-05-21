from django.db import models
import uuid
import os
from accounts.models import UserAccount

def get_image_path(instance, filename):
    return os.path.join('customers', str(instance.id), filename)
# Create your models here.
class Customer(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False, unique=True)
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=50)
    address = models.CharField(max_length=255, blank=True, null=True)
    photo = models.ImageField(upload_to=get_image_path, blank=True,null=True, default='global/no-image.jpg')
    account = models.ForeignKey(UserAccount, blank=True, null=True, default=None, on_delete=models.SET_NULL, related_name='customer_account')
    @property
    def __str__(self):
        return f"{self.name} - {self.phone_number}"