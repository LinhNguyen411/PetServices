from django.db import models
import uuid
import os
# Create your models here.

def get_image_path(instance, filename):
    return os.path.join('employees', str(instance.id), filename)

class Employee(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=50)
    address = models.CharField(max_length=255)
    role = models.CharField(max_length = 50, default="employee")
    photo = models.ImageField(upload_to=get_image_path, blank=True,null=True, default='global/no-image.jpg')
    @property
    def full_name(self):
        return self.first_name + self.last_name

class WorkSchedule(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False, unique=True)
    employee = models.ForeignKey(Employee,on_delete=models.PROTECT, related_name="allot")
    date = models.DateField()
    note = models.TextField()