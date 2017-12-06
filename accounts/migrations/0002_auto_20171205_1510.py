# -*- coding: utf-8 -*-
# Generated by Django 1.10.8 on 2017-12-05 20:10
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='IntranetURL',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.CharField(max_length=120)),
            ],
            options={
                'verbose_name': 'Intranet URL',
                'verbose_name_plural': 'Intranet URLs',
            },
        ),
        migrations.AddField(
            model_name='user',
            name='calendar_condensed_view',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='calendar_preference',
            field=models.CharField(choices=[('Spaces', '1'), ('Calendar', '2')], default='Calendar', max_length=60),
        ),
        migrations.AddField(
            model_name='user',
            name='startup_page',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='accounts', to='accounts.IntranetURL'),
        ),
    ]