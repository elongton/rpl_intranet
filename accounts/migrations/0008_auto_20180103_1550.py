# -*- coding: utf-8 -*-
# Generated by Django 1.10.8 on 2018-01-03 20:50
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0007_auto_20180103_1540'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='staff',
            field=models.BooleanField(default=False),
        ),
    ]
