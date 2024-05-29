from django.db import models
import random
import os
from datetime import datetime
from accounts.models import UserAccount
# Create your models here.

STATUS_CHOICES = [
    ("w", "working"),
    ("q", "quit"),
    ("l", "leave")
]

ROLE_CHOICES = [
    ("m", "manager"),
    ("e", "employee"),
    ("s", "security"),
]

def get_image_path(instance, filename):
    return os.path.join('employees', str(instance.id), filename)

class Employee(models.Model):
    id = models.IntegerField(primary_key=True, editable=False)

    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=50)
    date_of_joining = models.DateField(default=datetime.today().strftime('%d/%m/%Y'),blank=True,null=True)
    status = models.CharField(max_length=50, default="w",choices=STATUS_CHOICES)
    role = models.CharField(max_length = 50, default="e", choices=ROLE_CHOICES)
    photo = models.ImageField(upload_to=get_image_path, blank=True,null=True, default='global/no-image.jpg')
    account = models.ForeignKey(UserAccount, blank=True, null=True, default=None, on_delete=models.SET_NULL, related_name='employee_account')
    def save(self, *args, **kwargs):
        if not self.id:
            self.id = self.generate_unique_id()
        super(Employee, self).save(*args, **kwargs)


    def generate_unique_id(self):
        unique_id = random.randint(100000, 999999)
        while Employee.objects.filter(id=unique_id).exists():
            unique_id = random.randint(100000, 999999)
        return unique_id
    def __str__(self):
        return f"{self.name} - {self.id}"

class WorkSchedule(models.Model):
    employee = models.ForeignKey(Employee,on_delete=models.PROTECT, related_name="allot")
    date = models.DateField()
    start_time = models.TimeField(default=None, blank=True, null=True)
    end_time = models.TimeField(default=None, blank=True, null=True)
    note = models.TextField(blank=True,null=True)

    def __str__(self):
        return f"{self.date} - {self.employee.name}"