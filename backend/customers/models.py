from django.db import models
import uuid
import os

def get_image_path(instance, filename):
    return os.path.join('customers', str(instance.id), filename)
# Create your models here.
class Customer(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=50)
    address = models.CharField(max_length=255, blank=True, null=True)
    photo = models.ImageField(upload_to=get_image_path, blank=True,null=True, default='global/no-image.jpg')
    @property
    def full_name(self):
        return self.first_name + " " + self.last_name
    def __str__(self):
        return f"{self.full_name} - {self.phone_number}"