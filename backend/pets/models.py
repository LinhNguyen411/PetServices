from django.db import models
import uuid
from customers.models import Customer
import os

# Create your models here.
class Species(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True,editable=False,unique=True)
    name = models.CharField(max_length=255)
    def __str__(self):
        return self.name

class Weight(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True,editable=False,unique=True)
    species = models.ForeignKey(Species, on_delete=models.SET_NULL, related_name="weight_species", blank=True, null=True)
    weight_range = models.CharField(max_length=255)
    weight_type = models.CharField(max_length=50)
    def __str__(self):
        return f"{self.species.name} {self.weight_range}"
    
def get_image_path(instance, filename):
    return os.path.join('pets', str(instance.id), filename)

class Pet(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True,editable=False,unique=True)
    name = models.CharField(max_length=255)
    year_of_birth = models.IntegerField(default=0)
    owner = models.ForeignKey(Customer, on_delete=models.SET_NULL, related_name="owner", default=None,null=True,blank=True)
    gender = models.BooleanField(default=0)
    weight = models.ForeignKey(Weight, on_delete=models.SET_NULL, related_name="have_weight", blank=True, null=True)
    species = models.ForeignKey(Species, on_delete=models.SET_NULL, related_name="belong_species", blank=True, null=True)
    photo = models.ImageField(upload_to=get_image_path, blank=True,null=True, default='global/no-image.jpg')
    def __str__(self):
        return self.name