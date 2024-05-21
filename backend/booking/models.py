from django.db import models
import uuid
from datetime import datetime
from customers.models import Customer
from pets.models import Pet
from services.models import Service
from employees.models import Employee
import os

STATUS_CHOICES = [
    ("c", "completed"),
    ("a", "accept"),
    ("p", "proceed"),
    ("u", "unacept")
]

def get_image_path(instance, filename):
    return os.path.join('bookings', str(instance.id), filename)

def get_main_image_path(instance, filename):
    return os.path.join('bookings', str(instance.service_booking.id),str(instance.id), filename)


class Room(models.Model):
    id =  models.UUIDField(default=uuid.uuid4, primary_key=True,editable=False,unique=True)
    number = models.CharField(max_length=20)
    is_booked = models.BooleanField(default=False, blank=True)

    def __str__(self):
        return f"Room {self.number}"

class ServiceBooking(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True,editable=False,unique=True)
    date_booked = models.DateField(default=datetime.today().strftime('%Y-%m-%d'), blank=True)
    date_start = models.DateField()
    stay_days = models.IntegerField(default=0)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="u")
    customer = models.ForeignKey(Customer, related_name='customer_booked', on_delete=models.PROTECT)
    pet = models.ForeignKey(Pet, related_name='pet_booked', on_delete=models.PROTECT)
    service = models.ForeignKey(Service, related_name='service_booked', on_delete=models.PROTECT)
    photo = models.ImageField(upload_to=get_image_path, blank=True,null=True, default='global/no-image.jpg')

class SubService(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True,editable=False,unique=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="u")
    service_booking = models.ForeignKey(ServiceBooking, related_name='sub_booking', on_delete=models.PROTECT)
    service = models.ForeignKey(Service, related_name='sub_service_booked', on_delete=models.PROTECT)
    photo = models.ImageField(upload_to=get_main_image_path, blank=True,null=True, default='global/no-image.jpg')

class Diary(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True,editable=False,unique=True)
    content = models.TextField()
    employee = models.ForeignKey(Employee, related_name='employee_diary', on_delete=models.PROTECT)
    booking = models.ForeignKey(ServiceBooking, related_name='booking_diary', on_delete=models.PROTECT)
    time = models.DateTimeField(default=datetime.now, blank=True)

class PetCheckInOut(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True,editable=False,unique=True)
    date_checked_in = models.DateTimeField(default=datetime.now, blank=True)
    emp_checked_in = models.ForeignKey(Employee, related_name='employee_checkin_pet', on_delete=models.PROTECT, blank=True, null=True, default=None)
    date_checked_out = models.DateTimeField(default=None, blank=True, null=True)
    emp_checked_out = models.ForeignKey(Employee, related_name='employee_checkout_pet', on_delete=models.PROTECT, blank=True, null=True, default=None)
    booking = models.ForeignKey(ServiceBooking, related_name='booking_check_inout', on_delete=models.PROTECT)
    is_picked_up = models.BooleanField(default=False, blank=True)