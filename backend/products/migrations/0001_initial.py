# Generated by Django 5.0.5 on 2024-05-07 05:51

import django.db.models.deletion
import products.models
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('description', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('name', models.CharField(max_length=200)),
                ('image', models.ImageField(blank=True, null=True, upload_to=products.models.get_image_path)),
                ('price', models.FloatField(default=0.0)),
                ('slug', models.SlugField(default=None)),
                ('category', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='products', to='products.category')),
            ],
        ),
    ]