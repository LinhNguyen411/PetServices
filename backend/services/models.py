from django.db import models
import uuid
from pets.models import Weight,Species
# Create your models here.
class Service(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True,editable=False,unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    species =  models.ForeignKey(Species, on_delete=models.PROTECT,related_name="for_species")
    def __str__(self):
        return f"{self.name} - {self.species.name}"

class ServicePrice(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True,editable=False,unique=True)
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="belong_services")
    weight = models.ForeignKey(Weight, on_delete=models.CASCADE, related_name="from_weight")
    price = models.FloatField(default=0)