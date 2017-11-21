from django.db import models
from accounts.models import Branch
# Create your models here.
class CalendarBranchMapping(models.Model):  # this is an integer
    branch = models.ForeignKey(Branch, related_name = 'libcal_branches', blank=True, null=True)
    libcal_branch_id = models.PositiveIntegerField()
    libcal_calendar_id = models.PositiveIntegerField()


    def __str__(self):
        return self.branch.name
