from django.contrib import admin
from .models import Pet, Species,Weight
# Register your models here.
admin.site.register(Pet)
admin.site.register(Species)
admin.site.register(Weight)