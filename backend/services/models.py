from django.db import models
import random
from pets.models import Weight,Species
# Create your models here.
class Service(models.Model):
    id = models.IntegerField(primary_key=True, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField()
    species =  models.ForeignKey(Species, on_delete=models.PROTECT,related_name="for_species")
    price = models.FloatField(default=0)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = self.generate_unique_id()
        super(Service, self).save(*args, **kwargs)

    def generate_unique_id(self):
        unique_id = random.randint(100000, 999999)
        while Service.objects.filter(id=unique_id).exists():
            unique_id = random.randint(100000, 999999)
        return unique_id
    
    def __str__(self):
        return f"{self.name} - {self.species.name}"

class ServiceSurchanges(models.Model):
    service = models.ForeignKey(
        Service, on_delete=models.PROTECT,related_name="surchange_service"
    )
    weight = models.ForeignKey(
        Weight, on_delete=models.PROTECT,related_name="surchange_weight"
    )
    surchange = models.FloatField(default=0)