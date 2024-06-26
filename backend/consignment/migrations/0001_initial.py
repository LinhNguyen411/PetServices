# Generated by Django 5.0.5 on 2024-06-14 07:40

import datetime
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('booking', '0009_room_price_alter_servicebooking_date_booked'),
        ('customers', '0001_initial'),
        ('employees', '0005_alter_employee_date_of_joining'),
        ('pets', '0003_alter_pet_weight'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProvideGoods',
            fields=[
                ('id', models.IntegerField(editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('price', models.FloatField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='ServicePackage',
            fields=[
                ('id', models.IntegerField(editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('price', models.FloatField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Consignment',
            fields=[
                ('id', models.IntegerField(editable=False, primary_key=True, serialize=False)),
                ('date_time_create', models.DateTimeField(blank=True, default=datetime.datetime.now)),
                ('status', models.CharField(choices=[('e', 'cancel'), ('u', 'unpaid'), ('p', 'partpaid'), ('a', 'allpaid')], default='u', max_length=50)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='customer_consign', to='customers.customer')),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='employee_consign', to='employees.employee')),
                ('package', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='package_consign', to='consignment.servicepackage')),
            ],
        ),
        migrations.CreateModel(
            name='ConsignmentDetail',
            fields=[
                ('id', models.IntegerField(editable=False, primary_key=True, serialize=False)),
                ('is_paid', models.BooleanField(blank=True, default=False)),
                ('consignment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='detail_of_consignment', to='consignment.consignment')),
                ('pet', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pet_consignment', to='pets.pet')),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='room_consignment', to='booking.room')),
            ],
        ),
        migrations.CreateModel(
            name='ConsignmentInvoice',
            fields=[
                ('id', models.IntegerField(editable=False, primary_key=True, serialize=False)),
                ('date_time_create', models.DateTimeField(blank=True, default=datetime.datetime.now)),
                ('price', models.FloatField(default=0)),
                ('con_detail', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bill_of_consigment', to='consignment.consignmentdetail')),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='employee_consign_bill', to='employees.employee')),
            ],
        ),
        migrations.CreateModel(
            name='CareDetail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_time_create', models.DateTimeField(blank=True, default=datetime.datetime.now)),
                ('con_detail', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='care_of_consignment', to='consignment.consignmentdetail')),
                ('goods', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='goods_consign', to='consignment.providegoods')),
            ],
        ),
        migrations.CreateModel(
            name='ServicePackageDetail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('goods', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='package_goods', to='consignment.providegoods')),
                ('package', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='package_detail', to='consignment.servicepackage')),
            ],
        ),
    ]
