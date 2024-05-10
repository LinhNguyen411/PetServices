from django.db import models
import uuid
from customers.models import Customer

# Create your models here.
class Species(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True,editable=False,unique=True)
    name = models.CharField(max_length=255)

class Weight(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True,editable=False,unique=True)
    weight_range = models.CharField(max_length=255)

class Pet(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True,editable=False,unique=True)
    name = models.CharField(max_length=255)
    year_of_birth = models.IntegerField(default=0)
    owner = models.ForeignKey(Customer, on_delete=models.SET_NULL, related_name="owner", default=None,null=True,blank=True)
    gender = models.BooleanField(default=0)
    weight = models.ForeignKey(Weight, on_delete=models.SET_NULL, related_name="weight", blank=True, null=True)
    species = models.ForeignKey(Species, on_delete=models.SET_NULL, related_name="species", blank=True, null=True)