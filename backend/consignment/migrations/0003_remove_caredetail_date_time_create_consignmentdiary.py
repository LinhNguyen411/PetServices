# Generated by Django 5.0.5 on 2024-06-15 15:15

import datetime
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('consignment', '0002_caredetail_employee'),
        ('employees', '0006_alter_employee_date_of_joining'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='caredetail',
            name='date_time_create',
        ),
        migrations.CreateModel(
            name='ConsignmentDiary',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.CharField(max_length=1024)),
                ('date_time_create', models.DateTimeField(blank=True, default=datetime.datetime.now)),
                ('con_detail', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='dairy_of_consignment', to='consignment.consignmentdetail')),
                ('employee', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='employee_consign_diary', to='employees.employee')),
            ],
        ),
    ]