# Generated by Django 5.0.5 on 2024-06-16 01:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('consignment', '0003_remove_caredetail_date_time_create_consignmentdiary'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='consignment',
            name='package',
        ),
    ]