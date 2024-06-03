from django.db import models
import random
from customers.models import Customer
import os

# Create your models here.
class Species(models.Model):
    name = models.CharField(max_length=255)
    def __str__(self):
        return self.name
    
def get_image_path(instance, filename):
    return os.path.join('pets', str(instance.id), filename)

class Pet(models.Model):
    id = models.IntegerField(primary_key=True, editable=False)
    name = models.CharField(max_length=255)
    age = models.IntegerField(default=0)
    owner = models.ForeignKey(Customer, on_delete=models.SET_NULL, related_name="pets_owner", default=None,null=True)
    gender = models.BooleanField(default=0)
    weight = models.FloatField(default=0)
    species = models.ForeignKey(Species, on_delete=models.PROTECT, related_name="belong_species")
    photo = models.ImageField(upload_to=get_image_path, blank=True,null=True, default='global/no-image.jpg')

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = self.generate_unique_id()
        super(Pet, self).save(*args, **kwargs)

    def generate_unique_id(self):
        unique_id = random.randint(100000, 999999)
        while Pet.objects.filter(id=unique_id).exists():
            unique_id = random.randint(100000, 999999)
        return unique_id
    def __str__(self):
        return self.name