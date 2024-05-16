# Generated by Django 5.0.5 on 2024-05-11 08:51

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bills', '0009_alter_billproductitem_bill'),
    ]

    operations = [
        migrations.AlterField(
            model_name='billproductitem',
            name='bill',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='product_to_bill', to='bills.bill'),
        ),
        migrations.AlterField(
            model_name='billserviceitem',
            name='bill',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='service_to_bill', to='bills.bill'),
        ),
    ]