# Generated by Django 5.0.5 on 2024-05-11 06:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pets', '0002_weight_weight_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='weight',
            name='weight_type',
            field=models.CharField(max_length=50),
        ),
    ]