# Generated by Django 5.0.5 on 2024-05-27 14:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employees', '0002_alter_employee_date_of_joining'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employee',
            name='date_of_joining',
            field=models.DateField(blank=True, default='27/05/2024', null=True),
        ),
    ]
