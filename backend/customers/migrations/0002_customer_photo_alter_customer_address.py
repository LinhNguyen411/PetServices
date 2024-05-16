# Generated by Django 5.0.5 on 2024-05-10 06:28

import customers.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='photo',
            field=models.ImageField(blank=True, default='global/no-image.jpg', null=True, upload_to=customers.models.get_image_path),
        ),
        migrations.AlterField(
            model_name='customer',
            name='address',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]