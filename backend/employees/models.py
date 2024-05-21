from django.db import models
import uuid
import os
from datetime import datetime
from accounts.models import UserAccount
# Create your models here.

def get_image_path(instance, filename):
    return os.path.join('employees', str(instance.id), filename)

class Employee(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False, unique=True)
    first_name = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=50)
    date_of_joining = models.DateField(default=datetime.today().strftime('%Y-%m-%d'),blank=True,null=True)
    status = models.CharField(max_length=50, default="w", blank=True)
    role = models.CharField(max_length = 50, default="employee")
    photo = models.ImageField(upload_to=get_image_path, blank=True,null=True, default='global/no-image.jpg')
    account = models.ForeignKey(UserAccount, blank=True, null=True, default=None, on_delete=models.SET_NULL, related_name='employee_account')
    @property
    def __str__(self):
        return f"{self.name} - {self.id}"

class WorkSchedule(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False, unique=True)
    employee = models.ForeignKey(Employee,on_delete=models.PROTECT, related_name="allot")
    date = models.DateField()
    start_time = models.TimeField(default=None, blank=True, null=True)
    end_time = models.TimeField(default=None, blank=True, null=True)
    note = models.TextField(blank=True,null=True)

    def __str__(self):
        return f"{self.date} - {self.employee.name}"