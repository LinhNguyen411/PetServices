# Generated by Django 5.0.5 on 2024-05-31 03:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('booking', '0002_remove_servicebooking_photo_diary_photo_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='room',
            old_name='number',
            new_name='name',
        ),
    ]
