# Generated by Django 5.0.5 on 2024-06-17 00:24

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('consignment', '0008_alter_consignment_date_time_create_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='consignment',
            name='date_time_create',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2024, 6, 17, 0, 24, 32, 396761, tzinfo=datetime.timezone.utc)),
        ),
        migrations.AlterField(
            model_name='consignmentdiary',
            name='date_time_create',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2024, 6, 17, 0, 24, 32, 397619, tzinfo=datetime.timezone.utc)),
        ),
        migrations.AlterField(
            model_name='consignmentinvoice',
            name='date_time_create',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2024, 6, 17, 0, 24, 32, 397842, tzinfo=datetime.timezone.utc)),
        ),
    ]
