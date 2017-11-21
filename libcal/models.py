from django.db import models
from accounts.models import Branch
# Create your models here.
class CalendarBranchMapping(models.Model):  # this is an integer
    Branch = models.ForeignKey(Branch, related_name = 'libcal_branches', blank=True, null=True)
    Branch_ID = models.PositiveIntegerField()
    Calendar_ID = models.PositiveIntegerField()


    def __str__(self):
        return self.BranchName
