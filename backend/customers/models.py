from django.db import models
import uuid


# Create your models here.
class Customer(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=50)
    address = models.CharField(max_length=255)