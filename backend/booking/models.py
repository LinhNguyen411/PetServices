from django.db import models
import random
from datetime import datetime
from customers.models import Customer
from pets.models import Pet
from services.models import Service
from employees.models import Employee
import os

STATUS_CHOICES = [
    ("e", "cancel"),
    ("c", "completed"),
    ("a", "accept"),
    ("p", "proceed"),
    ("u", "unacept")
]

def get_image_path(instance, filename):
    return os.path.join('bookings', str(instance.id), filename)

def get_main_image_path(instance, filename):
    return os.path.join('bookings', str(instance.booking.id), filename)


class Room(models.Model):
    name = models.CharField(max_length=20)
    price = models.FloatField(default=0)
    is_booked = models.BooleanField(default=False, blank=True)

    def __str__(self):
        return f"Room {self.name}"

class ServiceBooking(models.Model):
    id = models.IntegerField(primary_key=True, editable=False)
    date_booked = models.DateField(default=datetime.today().strftime('%Y-%m-%d'), blank=True)
    date_start = models.DateField()
    stay_days = models.IntegerField(default=0)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="u")
    customer = models.ForeignKey(Customer, related_name='customer_booked', on_delete=models.PROTECT)
    pet = models.ForeignKey(Pet, related_name='pet_booked', on_delete=models.PROTECT)
    service = models.ForeignKey(Service, related_name='service_booked', on_delete=models.PROTECT)
    room = models.ForeignKey(Room, related_name='room_booked', on_delete=models.PROTECT, default=None)
    note = models.TextField(default=None, blank=True,null=True)
    def save(self, *args, **kwargs):
        if not self.id:
            self.id = self.generate_unique_id()
        super(ServiceBooking, self).save(*args, **kwargs)

    def generate_unique_id(self):
        unique_id = random.randint(100000, 999999)
        while ServiceBooking.objects.filter(id=unique_id).exists():
            unique_id = random.randint(100000, 999999)
        return unique_id

class SubServiceBooking(models.Model):
    booking = models.ForeignKey(ServiceBooking, related_name='booking_subservices', on_delete=models.CASCADE)
    service = models.ForeignKey(Service, related_name='subservice_booked', on_delete=models.CASCADE)
    is_completed = models.BooleanField(default=False)


class Diary(models.Model):
    time = models.DateTimeField(default=datetime.now, blank=True)
    employee = models.ForeignKey(Employee, related_name='employee_diary', on_delete=models.PROTECT)
    booking = models.ForeignKey(ServiceBooking, related_name='booking_diary', on_delete=models.CASCADE)
    content = models.TextField()
    photo = models.ImageField(upload_to=get_main_image_path, blank=True,null=True, default='global/no-image.jpg')

