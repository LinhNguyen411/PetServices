from django.db import models
import uuid
import os
from django.utils.text import slugify
from pets.models import Species
import random


# Create your models here.
def get_image_path(instance, filename):
    return os.path.join('products', str(instance.id), filename)

class Supplier(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=50)
    email = models.EmailField(max_length=255)
    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=200)
    def __str__(self):
        return self.name
    
def get_image_path(instance, filename):
    return os.path.join('products', str(instance.id), filename)

class Product(models.Model):
    id = models.IntegerField(primary_key=True, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField(default=None, blank=True, null=True)
    image = models.ImageField(upload_to=get_image_path, blank=True,null=True, default='global/no-image.jpg')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL,null=True,related_name="classify_category")
    species = models.ForeignKey(Species, on_delete=models.SET_NULL,null=True,related_name="classify_species")
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL,null=True,related_name="supply")
    quantity = models.IntegerField(default=0)
    price = models.FloatField(default=0.0)
    photo = models.ImageField(upload_to=get_image_path, blank=True,null=True, default='global/no-image.jpg')
    def save(self, *args, **kwargs):
        if not self.id:
            self.id = self.generate_unique_id()
        super(Product, self).save(*args, **kwargs)

    def generate_unique_id(self):
        unique_id = random.randint(100000, 999999)
        while Product.objects.filter(id=unique_id).exists():
            unique_id = random.randint(100000, 999999)
        return unique_id
    def __str__(self):
        return self.name


