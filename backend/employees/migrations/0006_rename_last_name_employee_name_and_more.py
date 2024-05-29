# Generated by Django 5.0.5 on 2024-05-21 04:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employees', '0005_alter_employee_date_join'),
    ]

    operations = [
        migrations.RenameField(
            model_name='employee',
            old_name='last_name',
            new_name='name',
        ),
        migrations.RemoveField(
            model_name='employee',
            name='date_join',
        ),
        migrations.AddField(
            model_name='employee',
            name='date_of_joining',
            field=models.DateField(blank=True, default='2024-05-21', null=True),
        ),
        migrations.AddField(
            model_name='employee',
            name='status',
            field=models.CharField(blank=True, default='w', max_length=50),
        ),
        migrations.AddField(
            model_name='workschedule',
            name='end_time',
            field=models.TimeField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='workschedule',
            name='start_time',
            field=models.TimeField(blank=True, default=None, null=True),
        ),
    ]