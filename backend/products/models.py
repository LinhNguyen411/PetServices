from django.db import models
import uuid
import os
from django.utils.text import slugify
from pets.models import Species


# Create your models here.
def get_image_path(instance, filename):
    return os.path.join('products', str(instance.id), filename)

class Supplier(models.Model):
    id = id = models.UUIDField(default=uuid.uuid4, primary_key=True,editable=False,unique=True)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=50)
    email = models.EmailField(max_length=255)
    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(default=None, blank=True)
    def __str__(self):
        return self.name
    
class Product(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True,editable=False,unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField(default=None, blank=True, null=True)
    image = models.ImageField(upload_to=get_image_path, blank=True,null=True, default='global/no-image.jpg')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, blank=True,null=True,related_name="classify_category")
    species = models.ForeignKey(Species, on_delete=models.SET_NULL, blank=True,null=True,related_name="classify_species")
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, blank=True,null=True,related_name="supply")
    price = models.FloatField(default=0.0)
    slug = models.SlugField(default=None, blank=True)
    def __str__(self):
        return self.name
    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Product, self).save(*args, **kwargs)


