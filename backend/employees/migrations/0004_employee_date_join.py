# Generated by Django 5.0.5 on 2024-05-11 06:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employees', '0003_alter_workschedule_note'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='date_join',
            field=models.DateField(auto_now_add=True, null=True),
        ),
    ]