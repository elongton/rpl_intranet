# -*- coding: utf-8 -*-
# Generated by Django 1.10.8 on 2017-11-06 16:58
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Medium',
            fields=[
                ('type', models.CharField(max_length=255)),
                ('id', models.IntegerField(primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Request',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time_length', models.PositiveSmallIntegerField(blank=True, null=True)),
                ('comment', models.TextField(blank=True)),
                ('create_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('over_five', models.BooleanField(default=False)),
                ('branch', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='accounts.Branch')),
                ('medium', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='requests', to='reference_stats.Medium')),
            ],
        ),
        migrations.CreateModel(
            name='TypeOfRequest',
            fields=[
                ('type', models.CharField(max_length=255)),
                ('id', models.IntegerField(primary_key=True, serialize=False)),
            ],
        ),
        migrations.AddField(
            model_name='request',
            name='type_of_request',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='requests', to='reference_stats.TypeOfRequest'),
        ),
        migrations.AddField(
            model_name='request',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
