# Generated by Django 5.0.5 on 2024-05-26 04:01

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('pets', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Service',
            fields=[
                ('id', models.IntegerField(editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('price', models.FloatField(default=0)),
                ('species', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='for_species', to='pets.species')),
            ],
        ),
        migrations.CreateModel(
            name='ServiceSurchanges',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('surchange', models.FloatField(default=0)),
                ('service', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='surchange_service', to='services.service')),
                ('weight', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='surchange_weight', to='pets.weight')),
            ],
        ),
    ]
