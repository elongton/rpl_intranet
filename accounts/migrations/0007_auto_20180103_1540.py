# -*- coding: utf-8 -*-
# Generated by Django 1.10.8 on 2018-01-03 20:40
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0006_auto_20171205_1536'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='staff',
            field=models.BooleanField(default=True),
        ),
    ]
