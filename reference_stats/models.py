from django.db import models
from django.contrib import admin
from datetime import datetime
from django.utils import timezone
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from django.dispatch import receiver

# from accounts.models import Branch

class Medium(models.Model):
    type = models.CharField(max_length=255)
    id = models.IntegerField(primary_key=True)

    def __str__(self):
        return self.type

class TypeOfRequest(models.Model):
    type = models.CharField(max_length=255)
    id = models.IntegerField(primary_key=True)

    def __str__(self):
        return self.type

# Create your models here.
class Request(models.Model):
    # user = models.ForeignKey(User)
    time_length = models.PositiveSmallIntegerField(blank=True, null=True)
    type_of_request = models.ForeignKey(TypeOfRequest, related_name='requests')
    medium = models.ForeignKey(Medium, related_name='requests')
    comment = models.TextField(blank=True)
    # branch = models.ForeignKey(Branch, blank=True, null=True)
    create_date = models.DateTimeField(default = timezone.now)
    # create_date = models.DateTimeField()
    over_five = models.BooleanField(default=False)

    def __str__(self):
        return str(self.type_of_request.type) + " / " + str(self.medium.type) + " / " + str(self.create_date)#.strftime('%b %d, %Y @ %I:%M %p'))

    def nowtime(self):
        return timezone.localtime(self.create_date)
    # def save(self, *args, **kwargs):
    #     self.create_date = timezone.now()
    #     return super(Request, self).save(*args, **kwargs)



class MediumAdmin(admin.ModelAdmin):
    list_display = ('type', 'id')
