# Generated by Django 5.0.5 on 2024-05-31 03:34

import accounts.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='useraccount',
            name='photo',
            field=models.ImageField(blank=True, default='global/no-image.jpg', upload_to=accounts.models.get_image_path),
        ),
    ]