from django.contrib import admin
from .models import Bill, BillProductItem, BillServiceItem
# Register your models here.
admin.site.register(Bill)
admin.site.register(BillProductItem)
admin.site.register(BillServiceItem)
