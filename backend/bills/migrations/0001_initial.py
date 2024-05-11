# Generated by Django 5.0.5 on 2024-05-11 03:35

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('customers', '0002_customer_photo_alter_customer_address'),
        ('employees', '0002_employee_photo_employee_role'),
        ('products', '0004_supplier_product_species_alter_product_category_and_more'),
        ('services', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Bill',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('status', models.BooleanField(default=False)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('data_paid', models.DateTimeField(blank=True, default=None, null=True)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='created_for', to='customers.customer')),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='created_by', to='employees.employee')),
            ],
        ),
        migrations.CreateModel(
            name='BillProductItem',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('quantity', models.IntegerField(default=0)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bill_service', to='products.product')),
            ],
        ),
        migrations.CreateModel(
            name='BillServiceItem',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('pet', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='for_pet', to='services.service')),
                ('service', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bill_service', to='services.service')),
            ],
        ),
    ]
